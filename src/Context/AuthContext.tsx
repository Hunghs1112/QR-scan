import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../utils/apiService';
import NotifService from '../utils/NotifService';
import PushNotification from 'react-native-push-notification';

interface AuthContextType {
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  name: string;
  setname: (name: string) => void;
  account_number?: string;
  setAccountNumber?: (account_number: string) => void;
  balance?: number;
  setBalance?: (balance: number) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [name, setname] = useState<string>('');
  const [account_number, setAccountNumber] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const registerPushToken = async () => {
    PushNotification.configure({
      onRegister: async (token) => {
        if (!isAuthenticated) {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        await NotifService.sendTokenToServer(token.token, {
          isAuthenticated,
          username,
        });
      },
      onRegistrationError: (err) => {
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: false,
    });

    try {
      const permissionResult = PushNotification.requestPermissions?.();
      if (permissionResult && typeof permissionResult.then === "function") {
        await permissionResult;
      }
    } catch (error) {
    }
  };

  const silentLogin = async (storedUsername: string, storedPassword: string) => {
    if (!storedUsername || !storedPassword) {
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('authData');
      setTimeout(() => setIsLoading(false), 100);
      return;
    }

    try {
      setIsLoading(true);
      const data = await login({ username: storedUsername, password: storedPassword });

      if (data.success && data.user) {
        setname(data.user.name || '');
        setAccountNumber?.(data.user.account_number || undefined);
        setBalance?.(data.user.balance !== undefined ? data.user.balance / 100 : undefined);
        setIsAuthenticated(true);
        setUsername(storedUsername);
        setPassword(storedPassword);

        const authData = {
          username: storedUsername,
          password: storedPassword,
          name: data.user.name || '',
          account_number: data.user.account_number || undefined,
          balance: data.user.balance !== undefined ? data.user.balance / 100 : undefined,
          isAuthenticated: true,
        };
        await AsyncStorage.setItem('authData', JSON.stringify(authData));
        await registerPushToken();
      } else {
        setIsAuthenticated(false);
        if (data.message?.includes('Invalid credentials')) {
          await AsyncStorage.removeItem('authData');
        }
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('authData');
      }
    } finally {
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem('authData');
        if (storedAuth) {
          const { username, password, name, account_number, balance, isAuthenticated } = JSON.parse(storedAuth);
          setUsername(username || '');
          setPassword(password || '');
          setname(name || '');
          setAccountNumber?.(account_number || undefined);
          setBalance?.(balance !== undefined ? balance : undefined);
          setIsAuthenticated(isAuthenticated || false);

          if (username && password) {
            await silentLogin(username, password);
          } else {
            setTimeout(() => setIsLoading(false), 100);
          }
        } else {
          setTimeout(() => setIsLoading(false), 100);
        }
      } catch (error) {
        setTimeout(() => setIsLoading(false), 100);
      }
    };
    loadAuthData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authData');
      setUsername('');
      setPassword('');
      setname('');
      setAccountNumber?.(undefined);
      setBalance?.(undefined);
      setIsAuthenticated(false);
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider
      value={{
        name,
        setname,
        username,
        setUsername,
        password,
        setPassword,
        isAuthenticated,
        setIsAuthenticated,
        account_number,
        setAccountNumber,
        balance,
        setBalance,
        logout,
        isLoading,
      }}
    >
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