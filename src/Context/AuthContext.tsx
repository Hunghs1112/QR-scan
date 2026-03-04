import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import { checkSession } from '../utils/apiService';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setname] = useState('');
  const [account_number, setAccountNumber] = useState<string | undefined>();
  const [balance, setBalance] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const sendFcmToken = async (username: string, token: string) => {
    try {
      console.log('AuthProvider: Sending FCM token to server:', { username, token });
      const response = await fetch('http://51.79.181.161:5000/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fcmToken: token }),
      });
      const result = await response.json();
      console.log('AuthProvider: Save token response:', result);
      if (!result.success) {
        console.warn('AuthProvider: Failed to save FCM token:', result.message);
      }
    } catch (error) {
      console.error('AuthProvider: Error sending FCM token:', error);
    }
  };

  useEffect(() => {
    
    const loadAuthData = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem('authData');
        if (storedAuth) {
          const { username, name, account_number, balance, password, session_token } = JSON.parse(storedAuth);
          // Kiểm tra session hợp lệ
          const deviceId = await DeviceInfo.getUniqueId();
          const sessionResponse = await checkSession(session_token, deviceId);
          if (sessionResponse.success) {
            setUsername(username || '');
            setname(name || '');
            setAccountNumber(account_number || undefined);
            setBalance(balance !== undefined ? balance : undefined);
            setPassword(password || '');
            setIsAuthenticated(true);

            // Register FCM token if user is authenticated
            const authStatus = await messaging().requestPermission({
              alert: true,
              badge: true,
              sound: true,
              provisional: true,
            });
            const enabled =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled && username) {
              const fcmToken = await messaging().getToken();
              if (fcmToken) {
                await sendFcmToken(username, fcmToken);
              }
            }
          } else {
            // Session không hợp lệ, xóa AsyncStorage
            await AsyncStorage.removeItem('authData');
            setUsername('');
            setPassword('');
            setname('');
            setAccountNumber(undefined);
            setBalance(undefined);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('loadAuthData error:', error);
        await AsyncStorage.removeItem('authData');
        setUsername('');
        setPassword('');
        setname('');
        setAccountNumber(undefined);
        setBalance(undefined);
        setIsAuthenticated(false);
      } finally {
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    loadAuthData();

    // Handle FCM token refresh
    const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      console.log('AuthProvider: FCM token refreshed:', newToken);
      if (username) {
        await sendFcmToken(username, newToken);
      }
    });

    return () => {
      unsubscribeOnTokenRefresh();
    };
  }, [username]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authData');
      setUsername('');
      setPassword('');
      setname('');
      setAccountNumber(undefined);
      setBalance(undefined);
      setIsAuthenticated(false);
      console.log('AuthProvider: Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const contextValue = useMemo(
    () => ({
      username,
      setUsername,
      password,
      setPassword,
      isAuthenticated,
      setIsAuthenticated,
      name,
      setname,
      account_number,
      setAccountNumber,
      balance,
      setBalance,
      logout,
      isLoading,
    }),
    [username, password, isAuthenticated, name, account_number, balance, isLoading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};