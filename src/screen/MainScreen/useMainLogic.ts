import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Animated, Alert, Platform } from 'react-native';
import { useAuth } from '../../Context/AuthContext';
import { login } from '../../utils/apiService';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Biometrics from 'react-native-biometrics';
import type { NavigationProp } from './types';

export const useMainLogic = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    name,
    username,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    password,
    setPassword,
    setname,
    setAccountNumber,
    setBalance,
    setUsername,
    logout: authLogout
  } = useAuth();

  const [localPassword, setLocalPassword] = useState<string>('');
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [inputPositionY] = useState<Animated.Value>(new Animated.Value(0));
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false); // Thêm state để track quá trình đăng nhập

  useEffect(() => {
    console.log('useMainLogic: Checking auth state:', {
      isAuthenticated,
      isLoading,
      username,
      name,
      isLoggingOut,
      isLoggingIn, // Thêm vào log
      currentRoute: navigation.getState().routes[navigation.getState().index]?.name
    });
    if (isLoggingOut || isLoading || isLoggingIn) { // Thêm isLoggingIn vào điều kiện bỏ qua
      console.log('useMainLogic: Skipping navigation check due to logout, loading, or login in progress');
      return;
    }
    const currentRoute = navigation.getState().routes[navigation.getState().index]?.name;
    console.log('useMainLogic: Auth state resolved, current route:', currentRoute);
    if (!username || !name) {
      if (currentRoute !== 'Login') {
        console.log('useMainLogic: Navigating to Login from:', currentRoute);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [isLoading, username, name, navigation, isLoggingOut, isLoggingIn]); // Removed isAuthenticated from dependency array

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      console.log('useMainLogic: Keyboard shown, current route:', navigation.getState().routes[navigation.getState().index]?.name);
      setKeyboardVisible(true);
      Animated.timing(inputPositionY, {
        toValue: -70,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      console.log('useMainLogic: Keyboard hidden, current route:', navigation.getState().routes[navigation.getState().index]?.name);
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
  }, [inputPositionY, navigation]);

  const handleLogin = async (password?: string): Promise<void> => {
    const loginPassword = password || localPassword;
    if (!username || !loginPassword) {
      console.log('useMainLogic.handleLogin: Login attempt failed: Missing username or password', { username, loginPassword });
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu!');
      return;
    }
    try {
      setIsLoggingIn(true); // Đặt trạng thái đang đăng nhập
      console.log('useMainLogic.handleLogin: Attempting login', { username, password: loginPassword });
      const data = await login({ username, password: loginPassword });
      console.log('useMainLogic.handleLogin: Login response', {
        success: data.success,
        user: data.user ? { name: data.user.name, account_number: data.user.account_number, balance: data.user.balance } : null,
        message: data.message,
      });
      if (data.success) {
        setname(data.user.name || '');
        setAccountNumber?.(data.user.account_number || undefined);
        setBalance?.(data.user.balance !== undefined ? data.user.balance : undefined);
        setPassword(loginPassword);
        setIsAuthenticated(true);

        // Save auth data to AsyncStorage
        const authData = {
          username,
          password: loginPassword,
          name: data.user.name || '',
          account_number: data.user.account_number || undefined,
          balance: data.user.balance !== undefined ? data.user.balance : undefined,
          session_token: data.session_token, // If returned from API
          isAuthenticated: true,
        };
        await AsyncStorage.setItem('authData', JSON.stringify(authData));
        console.log('useMainLogic.handleLogin: Saved auth data to AsyncStorage');

        console.log('useMainLogic.handleLogin: Login successful, navigating to Home from:', navigation.getState().routes[navigation.getState().index]?.name);

        // Force re-render and navigate after state settles
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }, 0);
      } else {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('useMainLogic.handleLogin: Login error', error);
      Alert.alert(
        'Lỗi',
        (error as Error).message || 'Đăng nhập thất bại. Vui lòng kiểm tra mật khẩu.'
      );
    } finally {
      setIsLoggingIn(false); // Reset trạng thái đăng nhập
    }
  };

const handleFaceID = async (): Promise<void> => {
  try {
    const rnBiometrics = new Biometrics();
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      console.log('useMainLogic.handleFaceID: Biometrics not available');
      Alert.alert('Lỗi', 'Face ID không khả dụng trên thiết bị này.');
      return;
    }

    if (biometryType !== 'FaceID' && Platform.OS === 'ios') {
      console.log('useMainLogic.handleFaceID: Face ID not supported, biometry type:', biometryType);
      Alert.alert('Lỗi', 'Thiết bị này không hỗ trợ Face ID.');
      return;
    }

    // Retrieve credentials from AsyncStorage (giữ giống handleLogin, nhưng cần username và password)
    let loginUsername = username;
    let loginPassword = password;

    if (!loginUsername || !loginPassword) {
      console.log('useMainLogic.handleFaceID: Login attempt failed: Missing username or password', { username, loginPassword });
      Alert.alert('Lỗi', 'Vui lòng nhập tài khoản và mật khẩu trước khi sử dụng Face ID!');
      navigation.navigate('Login');
      return;
    }

    setIsLoggingIn(true); // Đặt trạng thái đang đăng nhập cho Face ID
    // Perform biometric authentication
    const { success, error } = await rnBiometrics.simplePrompt({
      promptMessage: 'Xác thực bằng Face ID',
      fallbackPromptMessage: 'Sử dụng mật khẩu', // Fallback for Android
    });

    if (success) {
      console.log('useMainLogic.handleFaceID: Biometric authentication successful');
      try {
        console.log('useMainLogic.handleFaceID: Attempting login', { username: loginUsername, password: loginPassword });
        const data = await login({ username: loginUsername, password: loginPassword });
        console.log('useMainLogic.handleFaceID: Login response', {
          success: data.success,
          user: data.user ? { name: data.user.name, account_number: data.user.account_number, balance: data.user.balance } : null,
          message: data.message,
        });
        if (data.success) {
          setname(data.user.name || '');
          setAccountNumber?.(data.user.account_number || undefined);
          setBalance?.(data.user.balance !== undefined ? data.user.balance : undefined);
          setPassword(loginPassword);
          setIsAuthenticated(true);

          // Save auth data to AsyncStorage
          const authData = {
            username: loginUsername,
            password: loginPassword,
            name: data.user.name || '',
            account_number: data.user.account_number || undefined,
            balance: data.user.balance !== undefined ? data.user.balance : undefined,
            session_token: data.session_token, // If returned from API
            isAuthenticated: true,
          };
          await AsyncStorage.setItem('authData', JSON.stringify(authData));
          console.log('useMainLogic.handleFaceID: Saved auth data to AsyncStorage');

          console.log('useMainLogic.handleFaceID: Login successful, navigating to Home from:', navigation.getState().routes[navigation.getState().index]?.name);

          // Force re-render and navigate after state settles
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }, 0);
        } else {
          throw new Error(data.message || 'Đăng nhập thất bại');
        }
      } catch (error) {
        console.error('useMainLogic.handleFaceID: Login error', error);
        Alert.alert(
          'Lỗi',
          (error as Error).message || 'Đăng nhập thất bại. Vui lòng kiểm tra mật khẩu.'
        );
      } finally {
        setIsLoggingIn(false); // Reset trạng thái đăng nhập
      }
    } else {
      setIsLoggingIn(false); // Reset trạng thái nếu xác thực Face ID thất bại
      console.log('useMainLogic.handleFaceID: Biometric authentication failed', { error });
      Alert.alert('Lỗi', error || 'Xác thực Face ID thất bại. Vui lòng thử lại.');
    }
  } catch (error) {
    setIsLoggingIn(false); // Reset trạng thái nếu có lỗi
    console.error('useMainLogic.handleFaceID: Error during Face ID authentication', error);
    if ((error as any).name === 'LAErrorUserCancel') {
      Alert.alert('Hủy', 'Xác thực Face ID đã bị hủy.');
    } else if ((error as any).name === 'LAErrorBiometryNotEnrolled') {
      Alert.alert('Lỗi', 'Face ID chưa được thiết lập trên thiết bị này.');
    } else if ((error as any).name === 'LAErrorBiometryNotAvailable') {
      Alert.alert('Lỗi', 'Face ID không khả dụng trên thiết bị này.');
    } else {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi sử dụng Face ID. Vui lòng thử lại.');
    }
  }
};

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    try {
      // Đăng ký thiết bị cho remote messages trước khi lấy token (tránh lỗi iOS)
      if (Platform.OS === 'ios') {
        await messaging().registerDeviceForRemoteMessages();
      }

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
      console.log('useMainLogic.handleLogout: Logout successful, navigating to Login from:', navigation.getState().routes[navigation.getState().index]?.name);
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
    handleLogout,
    handleFaceID,
  };
};