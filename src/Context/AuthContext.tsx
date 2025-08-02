import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setname] = useState('');
  const [account_number, setAccountNumber] = useState<string | undefined>();
  const [balance, setBalance] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const registerPushToken = async (authUsername: string) => {
    PushNotification.configure({
      onRegister: async (token) => {
        await NotifService.sendTokenToServer(token.token, {
          isAuthenticated: true,
          username: authUsername,
        });
      },
      onRegistrationError: (err) => {
        console.error('Push token registration error:', err);
      },
      permissions: { alert: true, badge: true, sound: true },
      popInitialNotification: true,
      requestPermissions: false,
    });

    try {
      const permissionResult = PushNotification.requestPermissions?.();
      if (permissionResult && typeof permissionResult.then === 'function') {
        await permissionResult;
      }
    } catch (error) {
      console.error('Push permission error:', error);
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
        setUsername(storedUsername);
        setPassword(storedPassword);
        setname(data.user.name || '');
        setAccountNumber(data.user.account_number || undefined);
        setBalance(data.user.balance !== undefined ? data.user.balance / 100 : undefined);
        setIsAuthenticated(true);

        const authData = {
          username: storedUsername,
          password: storedPassword,
          name: data.user.name || '',
          account_number: data.user.account_number || undefined,
          balance: data.user.balance !== undefined ? data.user.balance / 100 : undefined,
          isAuthenticated: true,
        };
        await AsyncStorage.setItem('authData', JSON.stringify(authData));
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
    if (isAuthenticated && username) {
      registerPushToken(username);
    }
  }, [isAuthenticated, username]);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem('authData');
        if (storedAuth) {
          const {
            username,
            password,
            name,
            account_number,
            balance,
            isAuthenticated,
          } = JSON.parse(storedAuth);

          setUsername(username || '');
          setPassword(password || '');
          setname(name || '');
          setAccountNumber(account_number || undefined);
          setBalance(balance !== undefined ? balance : undefined);
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
        console.error('loadAuthData error:', error);
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
      setAccountNumber(undefined);
      setBalance(undefined);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ✅ Memo hóa context để tránh re-render không cần thiết
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
    [
      username,
      password,
      isAuthenticated,
      name,
      account_number,
      balance,
      isLoading,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
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
