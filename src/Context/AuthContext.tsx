import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  username: string;
  setUsername: (username: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  name: string;
  setname: (name: string) => void;
  account_number?: string;
  setAccountNumber?: (account_number: string) => void;
  balance?: number;
  setBalance?: (balance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [name, setname] = useState<string>('');
  const [account_number, setAccountNumber] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  return (
    <AuthContext.Provider value={{ name, setname, username, setUsername, isAuthenticated, setIsAuthenticated, account_number, setAccountNumber, balance, setBalance }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};