import React, { createContext, useContext, useState } from 'react';

export interface Bank {
  id: string;
  name: string;
  code: string;
  short_name: string;
  icon_url?: string;
}

interface BankContextType {
  banks: Bank[];
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank | null) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  return (
    <BankContext.Provider value={{ banks, selectedBank, setSelectedBank }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};