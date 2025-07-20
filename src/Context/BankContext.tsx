import React, { createContext, useContext, useState, ReactNode } from 'react';

type Bank = {
  id: string;
  name: string;
  code: string;
  bin: number;
  short_name: string;
  logo_url: string;
  icon_url: string;
  swift_code: string | null;
  lookup_supported: number;
};

interface BankContextType {
  banks: Bank[];
  setBanks: (banks: Bank[]) => void;
  selectedBank: Bank | null;
  setSelectedBank: (bank: Bank | null) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  return (
    <BankContext.Provider value={{ banks, setBanks, selectedBank, setSelectedBank }}>
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