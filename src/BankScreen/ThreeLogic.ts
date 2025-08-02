import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';

import { useTransaction } from '../Context/TransactionContext';
import { useAuth } from '../Context/AuthContext';
import { useBank } from '../Context/BankContext';

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
  key: 'c6b7d702-7d46-44d8-8d4b-9a5d2e0ac276key',
  secret: '8fbc5f31-dd43-4344-bcbb-79ae59fb8358secret',
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
  } = useTransaction();

  const { account_number, balance, name } = useAuth();
  const { banks, selectedBank, setSelectedBank } = useBank();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const defaultTransferContent = `${name || 'NGUYEN VAN A'} chuyen tien`;

  useEffect(() => {
    // Only set defaultTransferContent if transferContent is not yet initialized
    if (transferContent === undefined || transferContent === null) {
      setTransferContent(defaultTransferContent);
    }
  }, [defaultTransferContent, setTransferContent]);

  const formatVND = useCallback((amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    if (isNaN(num) || num === 0) return '0';
    return Math.floor(num).toLocaleString('en-US');
  }, []);

  const fetchRecipientInfo = useCallback(async (accountNumber: string, bankCode: string) => {
    if (!bankCode || !accountNumber) return;

    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

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

      const ownerName =
        data.success && data.data?.ownerName
          ? data.data.ownerName
          : data.message === 'Hết credit'
          ? 'Hết credit'
          : 'Nguyen Van A';

      setRecipientName(ownerName);
    } catch (err) {
      setRecipientName('Nguyen Van A');
    } finally {
      setLoading(false);
    }
  }, [setRecipientName, setLoading]);

  const debounce = useCallback((func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedFetchRecipientInfo = useCallback(
    debounce(fetchRecipientInfo, 1000),
    [fetchRecipientInfo],
  );

  const handleAmountChange = useCallback((value: string) => {
    setAmount(value.replace(/[^0-9]/g, ''));
  }, [setAmount]);

  const handleContinue = useCallback(() => {
    const parsedAmount = parseFloat(amount || '0');

    if (
      !recipientAccountNumber ||
      !recipientName ||
      !amount ||
      parsedAmount <= 0 ||
      !selectedBank ||
      !account_number ||
      !name
    ) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin cần thiết.');
      return;
    }

    if (balance !== undefined && parsedAmount > balance) {
      Alert.alert('Lỗi', 'Số dư không đủ để thực hiện giao dịch!');
      return;
    }

    navigation.navigate('Confirm');
  }, [
    recipientAccountNumber,
    recipientName,
    amount,
    selectedBank,
    account_number,
    name,
    balance,
    navigation,
  ]);

  useEffect(() => {
    if (recipientAccountNumber && selectedBank?.code) {
      debouncedFetchRecipientInfo(recipientAccountNumber, selectedBank.code);
    } else {
      setRecipientName('');
    }
  }, [recipientAccountNumber, selectedBank?.code, debouncedFetchRecipientInfo, setRecipientName]);

  useEffect(() => {
    return () => {
      setRecipientAccountNumber('');
      setRecipientName('');
      setAmount('');
      setTransferContent(defaultTransferContent);
      setSelectedBank(null);
    };
  }, [
    setRecipientAccountNumber,
    setRecipientName,
    setAmount,
    setTransferContent,
    setSelectedBank,
    defaultTransferContent,
  ]);

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
    banks,
    account_number,
    balance,
    name,
    handleAmountChange,
    handleContinue,
    formatVND,
    defaultTransferContent,
  };
};