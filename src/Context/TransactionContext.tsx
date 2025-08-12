import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { debounce } from 'lodash';

interface TransactionContextType {
  recipientAccountNumber: string;
  setRecipientAccountNumber: (accountNumber: string) => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  transferContent: string;
  setTransferContent: (content: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clearContext: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { name } = useAuth();
  const [recipientAccountNumber, _setRecipientAccountNumber] = useState('');
  const [recipientName, _setRecipientName] = useState('');
  const [amount, _setAmount] = useState('');
  const [transferContent, _setTransferContent] = useState('');
  const [loading, _setLoading] = useState(false);

  const setRecipientAccountNumber = useCallback((value: string) => {
    _setRecipientAccountNumber(value);
  }, []);

  const setRecipientName = useCallback((value: string) => {
    _setRecipientName(value);
  }, []);

  const setAmount = useCallback(
    debounce((value: string) => {
      _setAmount(value);
    }, 300),
    []
  );

  const setTransferContent = useCallback((value: string) => {
    _setTransferContent(value);
  }, []);

  const setLoading = useCallback((value: boolean) => {
    _setLoading(value);
  }, []);

  const clearContext = useCallback(() => {
    _setRecipientAccountNumber('');
    _setRecipientName('');
    _setAmount('');
    _setTransferContent('');
    _setLoading(false);
  }, []);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
      recipientAccountNumber,
      recipientName,
      amount,
      transferContent,
      loading,
      clearContext,
    ]
  );

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};