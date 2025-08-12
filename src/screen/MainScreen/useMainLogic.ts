import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Animated, Alert } from 'react-native';
import { useAuth } from '../../Context/AuthContext';
import { login } from '../../utils/apiService';
import messaging from '@react-native-firebase/messaging';
import type { NavigationProp } from './types';

export const useMainLogic = () => {
  const navigation = useNavigation<NavigationProp>();
  const { name, username, isAuthenticated, setIsAuthenticated, isLoading, setPassword, setname, setAccountNumber, setBalance, logout: authLogout } = useAuth();
  const [localPassword, setLocalPassword] = useState<string>('');
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [inputPositionY] = useState<Animated.Value>(new Animated.Value(0));
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  useEffect(() => {
    console.log('useMainLogic: Checking auth state:', { isAuthenticated, isLoading, username, name, isLoggingOut });
    if (isLoggingOut || isLoading) {
      return; // Bỏ qua kiểm tra nếu đang logout hoặc đang tải
    }
    console.log('useMainLogic: Auth state resolved, navigating based on username and name:', { username, name });
    if (!username || !name) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isLoading, username, name, navigation, isLoggingOut]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      console.log('useMainLogic: Keyboard shown');
      setKeyboardVisible(true);
      Animated.timing(inputPositionY, {
        toValue: -70,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      console.log('useMainLogic: Keyboard hidden');
      setKeyboardVisible(false);
      Animated.timing(inputPositionY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      console.log('useMainLogic: Cleaning up keyboard listeners');
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [inputPositionY]);

  const handleLogin = async (): Promise<void> => {
    if (!username || !localPassword) {
      console.log('useMainLogic.handleLogin: Login attempt failed: Missing username or password', { username, localPassword });
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu!');
      return;
    }
    try {
      console.log('useMainLogic.handleLogin: Attempting login', { username, password: localPassword });
      const data = await login({ username, password: localPassword });
      console.log('useMainLogic.handleLogin: Login response', {
        success: data.success,
        user: data.user ? { name: data.user.name, account_number: data.user.account_number, balance: data.user.balance } : null,
        message: data.message,
      });
      if (data.success) {
        setname(data.user.name || '');
        setAccountNumber?.(data.user.account_number || undefined);
        setBalance?.(data.user.balance !== undefined ? data.user.balance : undefined);
        setPassword(localPassword);
        setIsAuthenticated(true);

        console.log('useMainLogic.handleLogin: Login successful, setting isAuthenticated to true');
        navigation.navigate('Home');
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('useMainLogic.handleLogin: Login error', error);
      Alert.alert(
        'Lỗi',
        (error as Error).message || 'Đăng nhập thất bại. Vui lòng kiểm tra mật khẩu.'
      );
    }
  };

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      // Get the current FCM token
      const fcmToken = await messaging().getToken();
      if (fcmToken && username) {
        console.log('useMainLogic.handleLogout: Sending delete token request:', { username, fcmToken });
        const response = await fetch('http://51.79.181.161:5000/delete-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, fcmToken }),
        });
        const result = await response.json();
        console.log('useMainLogic.handleLogout: Delete token response:', result);
        if (!result.success) {
          console.warn('useMainLogic.handleLogout: Failed to delete FCM token:', result.message);
        }
      } else {
        console.warn('useMainLogic.handleLogout: No FCM token or username available');
      }

      // Proceed with logout
      await authLogout();
      setLocalPassword('');
      console.log('useMainLogic.handleLogout: Logout successful');
    } catch (error) {
      console.error('useMainLogic.handleLogout: Error during logout', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    localPassword,
    setLocalPassword,
    inputPositionY,
    handleLogin,
    name,
    handleLogout, // Export handleLogout for use in MainCard
  };
};