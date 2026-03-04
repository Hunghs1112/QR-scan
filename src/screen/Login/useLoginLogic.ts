import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Animated, Alert } from 'react-native';
import { useAuth } from '../../Context/AuthContext';
import { login } from '../../utils/apiService';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NavigationProp } from './types';

export const useLoginLogic = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    name,
    setname,
    username,
    setUsername,
    setPassword,
    isAuthenticated,
    setIsAuthenticated,
    account_number,
    setAccountNumber,
    balance,
    setBalance,
    isLoading: authLoading,
    logout: authLogout,
  } = useAuth();
  const [password, setLocalPassword] = useState<string>('');
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [inputPositionY] = useState<Animated.Value>(new Animated.Value(0));

  useEffect(() => {
    console.log('useLoginLogic: Checking authentication state:', { isAuthenticated, authLoading });
    if (!authLoading && isAuthenticated) {
      console.log('useLoginLogic: User authenticated, navigating to Main');
      navigation.navigate('Main');
    }

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      console.log('useLoginLogic: Keyboard shown');
      setKeyboardVisible(true);
      Animated.timing(inputPositionY, {
        toValue: -70,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      console.log('useLoginLogic: Keyboard hidden');
      setKeyboardVisible(false);
      Animated.timing(inputPositionY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      console.log('useLoginLogic: Cleaning up keyboard listeners');
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [inputPositionY, isAuthenticated, authLoading, navigation]);

  const sendFcmToken = async (username: string, token: string) => {
    try {
      console.log('useLoginLogic: Sending FCM token to server:', { username, token });
      const response = await fetch('http://51.79.181.161:5000/save-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fcmToken: token }),
      });
      const result = await response.json();
      console.log('useLoginLogic: Save token response:', result);
      if (!result.success) {
        console.warn('useLoginLogic: Failed to save FCM token:', result.message);
      }
    } catch (error) {
      console.error('useLoginLogic: Error sending FCM token:', error);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!username || !password) {
      console.log('useLoginLogic: Login attempt failed: Missing username or password', { username, password });
      Alert.alert('Lỗi', 'Vui lòng nhập tài khoản và mật khẩu!');
      return;
    }
    try {
      console.log('useLoginLogic: Attempting login with:', { username, password });
      const data = await login({ username, password });
      console.log('useLoginLogic: Login response:', {
        success: data.success,
        user: data.user ? { name: data.user.name, account_number: data.user.account_number, balance: data.user.balance } : null,
        session_token: data.session_token,
        message: data.message,
      });
      if (data.success) {
        setname(data.user.name || '');
        setAccountNumber?.(data.user.account_number || undefined);
        setBalance?.(data.user.balance);
        setIsAuthenticated(true);
        setUsername(username);
        setPassword(password);

        const authData = {
          username,
          password,
          name: data.user.name || '',
          account_number: data.user.account_number || undefined,
          balance: data.user.balance !== undefined ? data.user.balance / 100 : undefined,
          isAuthenticated: true,
          session_token: data.session_token, // Thêm session_token
        };
        await AsyncStorage.setItem('authData', JSON.stringify(authData));
        console.log('useLoginLogic: Saved auth data to AsyncStorage:', authData);

        // Send FCM token after successful login
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

        console.log('useLoginLogic: Navigating to Main');
        navigation.navigate('Main');
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('useLoginLogic: Login error:', error);
      Alert.alert(
        'Lỗi',
        (error as Error).message || 'Đăng nhập thất bại. Vui lòng kiểm tra tài khoản hoặc mật khẩu.'
      );
    }
  };

  const logout = async () => {
    console.log('useLoginLogic: Initiating logout');
    await authLogout();
    setLocalPassword('');
  };

  return {
    username,
    setUsername,
    password,
    setLocalPassword,
    inputPositionY,
    handleLogin,
    logout,
  };
};