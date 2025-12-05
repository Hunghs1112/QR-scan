import { useState, useEffect, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, Keyboard, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useTransaction } from '../Context/TransactionContext';
import { useBank } from '../Context/BankContext';
import { useAuth } from '../Context/AuthContext';
import { useLoading } from '../Context/LoadingContext'; // Import useLoading
import { cashOut } from '../utils/apiService';
import PushNotification from 'react-native-push-notification';
import { debounce } from 'lodash';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: { success?: boolean };
  History: undefined;
  FaceScan: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CashOutData {
  username: string;
  account_number: string;
  amount: number;
  recipient_name: string;
  recipient_account_number: string;
}

interface Bank {
  id: string;
  code: string;
  name: string;
}

interface FourLogicReturn {
  recipientAccountNumber: string;
  recipientName: string;
  amount: string;
  transferContent: string;
  selectedBank: Bank | null;
  username: string;
  account_number: string | undefined;
  name: string | undefined;
  balance: number | undefined;
  isModalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  otpModalVisible: boolean;
  setOtpModalVisible: Dispatch<SetStateAction<boolean>>;
  handleConfirm: () => void;
  handleOtpConfirm: () => Promise<void>;
  otp: string;
  digitalOtp: string;
  handleOtpInput: (text: string) => void;
  otpLoading: boolean;
  convertNumberToText: (value: string) => string;
  otpTimer: number;
  setDigitalOtp: Dispatch<SetStateAction<string>>;
  setOtpTimer: Dispatch<SetStateAction<number>>;
  formatVND: (value: string) => string;
}

export const useFourLogic = (): FourLogicReturn => {
  const navigation = useNavigation<NavigationProp>();
  const {
    recipientAccountNumber,
    recipientName,
    amount,
    transferContent,
    clearContext,
  } = useTransaction();
  const { selectedBank } = useBank();
  const { username, account_number, name, balance, setBalance } = useAuth();
  const { setLoading, isLoading } = useLoading(); // Sử dụng useLoading thay vì transactionLoading
  const [isModalVisible, setModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [digitalOtp, setDigitalOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(100);

  useEffect(() => {
    if (!otpModalVisible) return;
    setOtpTimer(100);
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setOtpModalVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [otpModalVisible, setOtpModalVisible]);

  const formatVND = useMemo(() => (value: string): string => {
    const num = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
    return num > 0 ? num.toLocaleString('en-US') : '0';
  }, []);

  const convertNumberToText = useMemo(() => (value: string): string => {
    const num = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
    if (num === 0) return 'Không đồng';

    const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
    const numbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

    const readThreeDigits = (num: number, isFirst: boolean): string => {
      const [hundred, ten, unit] = [Math.floor(num / 100), Math.floor((num % 100) / 10), num % 10];
      let result = '';
      if (hundred) result += `${numbers[hundred]} trăm `;
      else if (!isFirst && (ten > 0 || unit > 0)) result += 'không trăm ';
      if (ten === 1) result += `mười${unit === 1 ? ' một' : unit === 5 ? ' lăm' : unit ? ' ' + numbers[unit] : ''}`;
      else if (ten > 1) result += `${numbers[ten]} mươi${unit === 1 ? ' mốt' : unit === 5 ? ' lăm' : unit ? ' ' + numbers[unit] : ''}`;
      else if (unit) result += numbers[unit];
      return result.trim();
    };

    const padded = Math.floor(num).toString().padStart(Math.ceil(num.toString().length / 3) * 3, '0');
    return padded.match(/.{1,3}/g)!.map((chunk, i, arr) => {
      const part = parseInt(chunk);
      if (!part) return '';
      const unitIdx = arr.length - 1 - i;
      return `${readThreeDigits(part, i === 0)} ${units[unitIdx]}`;
    }).filter(Boolean).join(' ').replace(/ +/g, ' ').replace(/^./, (m) => m.toUpperCase()) + ' Việt Nam Đồng';
  }, []);

  const handleOtpInput = useCallback(debounce((text: string) => {
    const formatted = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(formatted);
    if (formatted.length === 6) {
      setDigitalOtp('76759528');
      setOtpModalVisible(true);
      setOtpTimer(100);
      Keyboard.dismiss();
    }
  }, 100), [setDigitalOtp, setOtpModalVisible, setOtpTimer]);

  const handleConfirm = useCallback(() => {
    const parsedAmount = parseFloat(amount.replace(/[^0-9]/g, '')) || 0;
    if (parsedAmount > 9999999) {
      setLoading(true); // Bật loading khi chuyển sang FaceScan
      navigation.navigate('FaceScan');
      setTimeout(() => setLoading(false), 500); // Tắt loading sau khi chuyển màn hình
    } else {
      setModalVisible(true);
    }
  }, [amount, navigation, setModalVisible, setLoading]);

  const handleOtpConfirm = useCallback(async () => {
    setOtpLoading(true);
    setLoading(true); // Bật loading từ LoadingContext
    try {
      const parsedAmount = parseFloat(amount.replace(/[^0-9]/g, '') || '0');
      if (!account_number || !name || !recipientAccountNumber || !recipientName || parsedAmount <= 0) {
        throw new Error('Vui lòng cung cấp đầy đủ thông tin!');
      }
      if (balance !== undefined && parsedAmount > balance) {
        throw new Error('Số dư không đủ!');
      }
      const data: CashOutData = {
        username,
        account_number,
        amount: parsedAmount,
        recipient_name: recipientName,
        recipient_account_number: recipientAccountNumber,
      };
      const response = await cashOut(data);
      setBalance?.(response.balance);

      const maskedAccount = `${account_number.slice(0, 2)}xxx${account_number.slice(-4)}`;
      const formattedAmount = `-${formatVND(amount)}VND`;
      const now = new Date();
      const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getFullYear().toString().slice(-2)} ${formattedTime}`;
      const balanceVND = formatVND(response.balance.toString());
      const transactionCode = `ACSP/P${Math.floor(Math.random() * 1e7).toString().padStart(7, '0')}`;
      const message = `TK:${maskedAccount}|GD: ${formattedAmount} ${formattedDate}|SD: ${balanceVND}VND|DEN: ${recipientName} - ${recipientAccountNumber}|ND: ${transferContent}- Ma GD ${transactionCode}`;

      setTimeout(() => {
        if (Platform.OS === 'ios') {
          PushNotificationIOS.addNotificationRequest({
            id: transactionCode,
            title: 'Thông báo biến động số dư',
            body: message,
            sound: 'default',
            userInfo: {
              transactionId: transactionCode,
              type: 'transaction',
            },
          });
        } else {
          PushNotification.localNotification({
            channelId: 'remote-channel',
            title: 'Thông báo biến động số dư',
            message: message,
            userInfo: {
              transactionId: transactionCode,
              type: 'transaction',
            },
            priority: 'high',
            importance: 'high',
            vibrate: true,
            soundName: 'default',
          });
        }
      }, 300);

      setOtp('');
      setDigitalOtp('');
      setOtpModalVisible(false);
      setModalVisible(false);
      navigation.navigate('Bill');
    } catch (error: any) {
      Alert.alert('Error', `Giao dịch thất bại: ${error.message}`);
    } finally {
      setOtpLoading(false);
      setLoading(false); // Tắt loading từ LoadingContext
    }
  }, [
    amount,
    account_number,
    name,
    recipientAccountNumber,
    recipientName,
    balance,
    username,
    setBalance,
    navigation,
    transferContent,
    formatVND,
    setLoading, // Thêm setLoading vào dependencies
  ]);

  return {
    recipientAccountNumber,
    recipientName,
    amount,
    transferContent,
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
    otpLoading,
    convertNumberToText,
    otpTimer,
    setDigitalOtp,
    setOtpTimer,
    formatVND,
  };
};