import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotifService from './NotifService';
import { useAuth } from './Context/AuthContext';
import { checkTransactions } from './apiService';

const NotificationHandler: React.FC = () => {
  const { username, isAuthenticated } = useAuth();
  const [lastTransactionTime, setLastTransactionTime] = useState<string | null>(null);

  // Load last transaction time from AsyncStorage
  useEffect(() => {
    const loadLastTransactionTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('lastTransactionTime');
        if (storedTime) {
          setLastTransactionTime(storedTime);
          console.log('Loaded lastTransactionTime:', storedTime);
        }
      } catch (error) {
        console.error('Error loading last transaction time:', error);
      }
    };
    loadLastTransactionTime();
  }, []);

  // Poll for new transactions every 30 seconds
  const pollTransactions = useCallback(async () => {
    if (!username || !isAuthenticated) {
      console.log('Skipping poll: User not authenticated or username missing');
      return;
    }
    try {
      const transactions = await checkTransactions(username, lastTransactionTime);
      console.log('Fetched new transactions:', transactions);
      if (!Array.isArray(transactions)) {
        console.warn('Transactions is not an array:', transactions);
        return;
      }
      if (transactions.length > 0) {
        transactions.forEach((transaction: { timestamp: string; amount: number; recipient_name: string; recipient_account_number: string; account_number: string }) => {
          // Format account number (e.g., 11111111 -> 11xxx1111)
          const maskedAccount = `${transaction.account_number.slice(0, 2)}xxx${transaction.account_number.slice(-4)}`;
          // Format amount with VND and + prefix
          const formattedAmount = `+${transaction.amount.toLocaleString('vi-VN')}VND`;
          // Format timestamp to DD/M/YY HH:MM (adjust to +07)
          const date = new Date(transaction.timestamp);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
          // Notification content
          const message = `TK ${maskedAccount}: ${formattedAmount}\n${formattedDate} |ND:\n${transaction.recipient_name} chuyen tien`;
          NotifService.sendLocalNotification('Nạp tiền thành công', message);
          console.log('Notification sent for transaction:', transaction);
        });
        const latestTime = transactions[transactions.length - 1].timestamp;
        setLastTransactionTime(latestTime);
        await AsyncStorage.setItem('lastTransactionTime', latestTime);
        console.log('Updated lastTransactionTime:', latestTime);
      } else {
        console.log('No new transactions');
      }
    } catch (error) {
      console.error('Error in pollTransactions:', error);
    }
  }, [username, isAuthenticated, lastTransactionTime]);

  useEffect(() => {
    if (username && isAuthenticated) {
      const interval = setInterval(pollTransactions, 3000); // Poll every 30 seconds
      pollTransactions(); // Initial poll
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [username, isAuthenticated, pollTransactions]);

  return null; // No UI
};

export default NotificationHandler;