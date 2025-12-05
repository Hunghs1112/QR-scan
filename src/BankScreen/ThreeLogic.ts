import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useTransaction } from '../Context/TransactionContext';
import { useBank } from '../Context/BankContext';
import { useAuth } from '../Context/AuthContext';

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

const API_CONFIG = {
  key: '38f3b25e-b174-4307-892a-0b301b356fc7key',
  secret: '2a03afc4-7c30-497c-91c3-c95134828c01secret',
  url: 'https://api.banklookup.net',
};

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
    clearContext,
  } = useTransaction();
  const { account_number, balance, name } = useAuth();
  const { banks, selectedBank, setSelectedBank } = useBank();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRecipientNameModalVisible, setIsRecipientNameModalVisible] = useState(false);
  const [isLimitedModalVisible, setIsLimitedModalVisible] = useState(false);

  const formatVND = useCallback((value: string): string => {
    const num = value.replace(/[^0-9]/g, '');
    if (!num) return '';
    return parseInt(num).toLocaleString('en-US', { minimumFractionDigits: 0 });
  }, []);

  const fetchRecipientInfo = useCallback(async (accountNumber: string, bankCode: string) => {
    if (!bankCode || !accountNumber) return;
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: {
          'x-api-key': API_CONFIG.key,
          'x-api-secret': API_CONFIG.secret,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bank: bankCode, account: accountNumber }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data?.ownerName) {
        setRecipientName(data.data.ownerName);
      } else {
        setIsRecipientNameModalVisible(true);
      }
    } catch (err) {
      setIsRecipientNameModalVisible(true);
    } finally {
      setLoading(false);
    }
  }, [setRecipientName, setLoading, setIsRecipientNameModalVisible]);

  const debounce = useCallback((func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedFetchRecipientInfo = useCallback(
    debounce(fetchRecipientInfo, 1000),
    [fetchRecipientInfo]
  );

  const handleContinue = useCallback(
    async (displayAmount: string, displayTransferContent: string) => {
      const cleanAmount = displayAmount.replace(/[^0-9]/g, '');
      const parsedAmount = parseFloat(cleanAmount || '0');
      const cleanTransferContent = displayTransferContent.trim() || (name ? `${name} chuyen tien` : 'Khach Hang chuyen tien');

      if (!recipientAccountNumber || !recipientName || !cleanAmount || parsedAmount <= 0 || !selectedBank || !account_number) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin cần thiết.');
        return;
      }
      if (balance !== undefined && parsedAmount > balance) {
        Alert.alert('Lỗi', 'Số dư không đủ để thực hiện giao dịch!');
        return;
      }

      // Kiểm tra trạng thái limited từ API
      try {
        setLoading(true);
        const response = await fetch(`http://51.79.181.161:5000/user/${account_number}`);
        const data = await response.json();
        
        if (data.success && data.user?.limited === 1) {
          setIsLimitedModalVisible(true);
          return;
        }
      } catch (error) {
        console.error('Error checking limited status:', error);
      } finally {
        setLoading(false);
      }

      setAmount(cleanAmount);
      setTransferContent(cleanTransferContent);
      navigation.navigate('Confirm');
    },
    [recipientAccountNumber, recipientName, selectedBank, account_number, balance, name, setAmount, setTransferContent, setLoading, navigation]
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const isNavigatingToConfirm =
        e.data.action.type === 'NAVIGATE' &&
        e.data.action.payload &&
        'name' in e.data.action.payload &&
        e.data.action.payload.name === 'Confirm';
      if (!isNavigatingToConfirm) {
        clearContext();
        setSelectedBank(null);
      }
    });
    return unsubscribe;
  }, [navigation, clearContext, setSelectedBank]);

  const handleLimitedModalClose = useCallback(() => {
    setIsLimitedModalVisible(false);
    clearContext();
    setSelectedBank(null);
    navigation.navigate('Home');
  }, [navigation, clearContext, setSelectedBank]);

  return {
    recipientAccountNumber,
    setRecipientAccountNumber,
    recipientName,
    setRecipientName,
    amount,
    setAmount,
    transferContent,
    setTransferContent,
    loading,
    selectedBank,
    setSelectedBank,
    isModalVisible,
    setIsModalVisible,
    isRecipientNameModalVisible,
    setIsRecipientNameModalVisible,
    isLimitedModalVisible,
    handleLimitedModalClose,
    banks,
    account_number,
    balance,
    handleContinue,
    formatVND,
    debouncedFetchRecipientInfo,
  };
};