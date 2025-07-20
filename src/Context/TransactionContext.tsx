import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TransactionContextType {
  recipientAccountNumber: string;
  setRecipientAccountNumber: (accountNumber: string) => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  amountText: string;
  setAmountText: (text: string) => void;
  transferContent: string;
  setTransferContent: (content: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipientAccountNumber, setRecipientAccountNumber] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [amountText, setAmountText] = useState<string>('');
  const [transferContent, setTransferContent] = useState<string>('CHUYEN TIEN');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <TransactionContext.Provider
      value={{
        recipientAccountNumber,
        setRecipientAccountNumber,
        recipientName,
        setRecipientName,
        amount,
        setAmount,
        amountText,
        setAmountText,
        transferContent,
        setTransferContent,
        loading,
        setLoading,
      }}
    >
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