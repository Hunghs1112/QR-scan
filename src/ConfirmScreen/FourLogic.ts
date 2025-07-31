import { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTransaction } from '../Context/TransactionContext';
import { useBank } from '../Context/BankContext';
import { useAuth } from '../Context/AuthContext';
import { cashOut } from '../utils/apiService';
import NotifService from '../utils/NotifService';
import { Alert, Keyboard } from 'react-native';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useFourLogic = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recipientAccountNumber, recipientName, amount, transferContent, setLoading: setTransactionLoading, loading: transactionLoading } = useTransaction();
  const { selectedBank } = useBank();
  const { username, account_number, name, balance, setBalance } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [digitalOtp, setDigitalOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(100);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (otpModalVisible) {
      setOtpTimer(100);
      timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            setOtpModalVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [otpModalVisible]);

  const formatVND = useCallback((amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num) || num === 0) return '0';
    const numStr = Math.floor(num).toString();
    let result = '';
    for (let i = numStr.length - 1, count = 0; i >= 0; i--) {
      result = numStr[i] + result;
      if (++count % 3 === 0 && i > 0) result = ',' + result;
    }
    return result;
  }, []);

  const convertNumberToText = useCallback((amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num) || num === 0) return 'Không đồng';

    const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
    const numbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const readThreeDigits = (num: number, isFirst: boolean): string => {
      const hundred = Math.floor(num / 100);
      const ten = Math.floor((num % 100) / 10);
      const unit = num % 10;
      let result = '';

      if (hundred > 0) {
        result += `${numbers[hundred]} trăm `;
      } else if (!isFirst && (ten > 0 || unit > 0)) {
        result += 'không trăm ';
      }

      if (ten === 1 && unit > 0) {
        result += `mười ${numbers[unit]}`;
      } else if (ten === 1) {
        result += 'mười';
      } else if (ten > 1) {
        result += `${numbers[ten]} mươi`;
        if (unit === 1) result += ' mốt';
        else if (unit === 5) result += ' lăm';
        else if (unit > 0) result += ` ${numbers[unit]}`;
      } else if (unit > 0) {
        result += numbers[unit];
      }

      return result.trim();
    };

    let result = '';
    let numStr = Math.floor(num).toString();
    let chunkCount = Math.ceil(numStr.length / 3);
    let paddedNum = numStr.padStart(chunkCount * 3, '0');

    for (let i = 0; i < chunkCount; i++) {
      const chunk = parseInt(paddedNum.slice(i * 3, (i + 1) * 3));
      if (chunk > 0) {
        const unitIndex = chunkCount - 1 - i;
        const isFirstChunk = i === 0;
        result += `${readThreeDigits(chunk, isFirstChunk)} ${units[unitIndex]} `;
      }
    }

    return result.charAt(0).toUpperCase() + result.slice(1).trim() + ' Việt Nam Đồng';
  }, []);

  const handleOtpInput = useCallback((text: string) => {
    const formattedOtp = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(formattedOtp);
    if (formattedOtp.length === 6) {
      setDigitalOtp('76759528');
      setOtpModalVisible(true);
      setOtpTimer(100);
      Keyboard.dismiss();
    }
  }, []);

  const handleConfirm = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleOtpConfirm = useCallback(async () => {
    setOtpLoading(true);
    try {
      const parsedAmount = parseFloat(amount?.replace(/,/g, '') || '0');
      if (!account_number || !name || !recipientAccountNumber || !recipientName || parsedAmount <= 0) {
        throw new Error('Vui lòng cung cấp đầy đủ thông tin!');
      }
      if (balance !== undefined && parsedAmount > balance) {
        throw new Error('Số dư không đủ!');
      }
      const data = { username, account_number, amount: parsedAmount, recipient_name: recipientName, recipient_account_number: recipientAccountNumber };
      const response = await cashOut(data);
      if (setBalance) setBalance(response.balance);

      const maskedAccount = `${account_number.slice(0, 2)}xxx${account_number.slice(-4)}`;
      const formattedAmount = `-${formatVND(parsedAmount)}VND`;
      const now = new Date();
      const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${formattedTime}`;
      const balanceVND = formatVND(response.balance);
      const transactionCode = `ACSP/P${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
      const message = `TK:${maskedAccount}|GD: ${formattedAmount} ${formattedDate}|SD: ${balanceVND}VND|DEN: ${recipientName} - ${recipientAccountNumber}|ND: ${name} chuyen tien- Ma GD ${transactionCode}`;

      NotifService.sendLocalNotification(`Thông báo biến động số dư`, message);

      setOtp('');
      setOtpModalVisible(false);
      setModalVisible(false);
      navigation.navigate('Bill');
    } catch (error) {
      Alert.alert('Error', `Giao dịch thất bại: ${(error as any).message}`);
    } finally {
      setOtpLoading(false);
    }
  }, [account_number, name, recipientAccountNumber, recipientName, amount, balance, setBalance, username, setTransactionLoading, navigation, formatVND, transferContent, recipientAccountNumber]);

  return {
    recipientAccountNumber,
    recipientName,
    amount,
    transferContent,
    transactionLoading,
    selectedBank,
    username,
    account_number,
    name,
    balance,
    isModalVisible,
    setModalVisible,
    otpModalVisible,
    setOtpModalVisible,
    handleConfirm,
    handleOtpConfirm,
    otp,
    digitalOtp,
    handleOtpInput,
    formatVND,
    otpLoading,
    convertNumberToText,
    otpTimer,
  };
};