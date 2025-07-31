import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTransaction } from '../Context/TransactionContext';
import { useAuth } from '../Context/AuthContext';
import { Alert, Keyboard } from 'react-native';

type RootStackParamList = {
  Main: undefined;
  Payment: undefined;
  Home: undefined;
  Bank: undefined;
  QRPage: undefined;
  Confirm: undefined;
  Bill: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Bank {
  id: string;
  name: string;
  code: string;
  short_name: string;
  icon_url?: string;
}

export const useThreeLogic = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    recipientAccountNumber,
    setRecipientAccountNumber,
    recipientName,
    setRecipientName,
    amount,
    setAmount,
    transferContent,
    setTransferContent,
    loading,
    setLoading,
  } = useTransaction();
  const { account_number, balance, name } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const apiKey = 'c6b7d702-7d46-44d8-8d4b-9a5d2e0ac276key';
  const apiSecret = '8fbc5f31-dd43-4344-bcbb-79ae59fb8358secret';

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('https://api.banklookup.net/bank/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setBanks(data.data);
        } else {
          Alert.alert('Lỗi', 'Không thể tải danh sách ngân hàng.');
          setBanks([]);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Lỗi kết nối đến máy chủ. Vui lòng kiểm tra URL hoặc kết nối internet.');
        setBanks([]);
      }
    };
    fetchBanks();
  }, []);

  const formatVND = useCallback((amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num) || num === 0) return '0';
    const numStr = Math.floor(num).toString();
    let result = '';
    for (let i = numStr.length - 1, count = 0; i >= 0; i--) {
      result = numStr[i] + result;
      count++;
      if (count % 3 === 0 && i > 0) {
        result = ',' + result;
      }
    }
    return result;
  }, []);

  const fetchRecipientInfo = useCallback(
    async (accountNumber: string, bankCode: string) => {
      if (!bankCode || !accountNumber) return;
      setLoading(true);
      let timeoutId: NodeJS.Timeout;
      try {
        const response = await Promise.race([
          fetch('https://api.banklookup.net', {
            method: 'POST',
            headers: { 'x-api-key': apiKey, 'x-api-secret': apiSecret, 'Content-Type': 'application/json' },
            body: JSON.stringify({ bank: bankCode, account: accountNumber }),
          }),
          new Promise((_, reject) => (timeoutId = setTimeout(() => reject(new Error('Timeout')), 3000))),
        ]);
        clearTimeout(timeoutId);
        if (!(response instanceof Response)) throw response;
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success && data.data?.ownerName) {
          setRecipientName(data.data.ownerName);
        } else if (data.message === 'Hết credit') {
          setRecipientName('Hết credit');
        } else {
          setRecipientName('Nguyen Van A');
        }
      } catch (error) {
        setRecipientName('Nguyen Van A');
      } finally {
        setLoading(false);
      }
    },
    [apiKey, apiSecret, setRecipientName, setLoading],
  );

  const debounce = useCallback((func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedFetchRecipientInfo = useCallback(
    debounce((accountNumber: string, bankCode: string) => {
      fetchRecipientInfo(accountNumber, bankCode);
    }, 1000),
    [fetchRecipientInfo],
  );

  const handleAmountChange = useCallback(
    (value: string) => {
      const cleanedValue = value.replace(/[^0-9]/g, '');
      setAmount(cleanedValue);
    },
    [setAmount],
  );

  const handleContinue = useCallback(() => {
    const parsedAmount = Number.parseFloat(amount || '0');
    if (
      !recipientAccountNumber ||
      !recipientName ||
      !amount ||
      parsedAmount <= 0 ||
      !selectedBank ||
      !account_number ||
      !name
    ) {
      Alert.alert(
        'Lỗi',
        'Vui lòng nhập đầy đủ thông tin: số tài khoản người nhận, tên người nhận, số tiền hợp lệ, ngân hàng, và đảm bảo bạn đã đăng nhập.',
      );
      return;
    }
    if (balance !== undefined && parsedAmount > balance) {
      Alert.alert('Lỗi', 'Số dư không đủ để thực hiện giao dịch!');
      return;
    }
    navigation.navigate('Confirm');
  }, [recipientAccountNumber, recipientName, amount, selectedBank, account_number, name, balance, navigation]);

  useEffect(() => {
    if (recipientAccountNumber && selectedBank) {
      debouncedFetchRecipientInfo(recipientAccountNumber, selectedBank.code);
    } else {
      setRecipientName('');
    }
  }, [recipientAccountNumber, selectedBank, debouncedFetchRecipientInfo, setRecipientName]);

  useEffect(() => {
    return () => {
      setRecipientAccountNumber('');
      setRecipientName('');
      setAmount('');
      setTransferContent('');
      setSelectedBank(null);
    };
  }, [setRecipientAccountNumber, setRecipientName, setAmount, setTransferContent, setSelectedBank]);

  return {
    recipientAccountNumber,
    setRecipientAccountNumber,
    recipientName,
    amount,
    setAmount,
    transferContent,
    setTransferContent,
    loading,
    selectedBank,
    setSelectedBank,
    isModalVisible,
    setIsModalVisible,
    banks,
    account_number,
    balance,
    name,
    handleAmountChange,
    handleContinue,
    formatVND,
  };
};