import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

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

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [recipientAccountNumber, _setRecipientAccountNumber] = useState('');
  const [recipientName, _setRecipientName] = useState('');
  const [amount, _setAmount] = useState('0');
  const [amountText, _setAmountText] = useState('');
  const [transferContent, _setTransferContent] = useState('');
  const [loading, _setLoading] = useState(false);

  // Memoized setters để tránh re-render không cần thiết
  const setRecipientAccountNumber = useCallback((value: string) => {
    _setRecipientAccountNumber(value);
  }, []);

  const setRecipientName = useCallback((value: string) => {
    _setRecipientName(value);
  }, []);

  const setAmount = useCallback((value: string) => {
    _setAmount(value);
  }, []);

  const setAmountText = useCallback((value: string) => {
    _setAmountText(value);
  }, []);

  const setTransferContent = useCallback((value: string) => {
    _setTransferContent(value);
  }, []);

  const setLoading = useCallback((value: boolean) => {
    _setLoading(value);
  }, []);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
