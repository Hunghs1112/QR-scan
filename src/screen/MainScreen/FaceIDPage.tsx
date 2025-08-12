import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  Dimensions,
  AppState,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { Camera, CameraPermissionRequestResult, useCameraDevices } from 'react-native-vision-camera';
import Svg, { Defs, Mask, Rect, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useAuth } from '../../Context/AuthContext';
import { login } from '../../utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: { success?: boolean };
  History: undefined;
  FaceScan: undefined;
  FaceID: undefined;
};

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

// Animated Ellipse
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const FaceIDPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [hasPermission, setHasPermission] = useState<CameraPermissionRequestResult | null>(null);
  const [checkCamera, setCheckCamera] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateStatus, setAppStateStatus] = useState(appState.current);
  const device = useCameraDevices().find((device) => device.position === 'front');
  const { 
    username, 
    password, 
    setname, 
    setAccountNumber, 
    setBalance, 
    setIsAuthenticated, 
    setUsername, 
    setPassword 
  } = useAuth();

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status);
    })();
  }, []);

  useEffect(() => {
    if (device) {
      const timer = setTimeout(() => {
        setIsCameraReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [device]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppStateStatus(nextAppState);
    });
    setAppStateStatus(AppState.currentState);
    return () => subscription.remove();
  }, []);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-login with face scan simulation
  useEffect(() => {
    timeoutRef.current = setTimeout(async () => {
      let loginUsername = username;
      let loginPassword = password;

      if (!loginUsername || !loginPassword) {
        try {
          const storedAuth = await AsyncStorage.getItem('authData');
          if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            loginUsername = authData.username || loginUsername;
            loginPassword = authData.password || '';
            console.log('FaceIDPage: Retrieved credentials from AsyncStorage:', { loginUsername, loginPassword });
          }
        } catch (error) {
          console.error('FaceIDPage: Error retrieving authData from AsyncStorage:', error);
        }
      }

      if (!loginUsername || !loginPassword) {
        console.log('FaceIDPage: Auto-login failed: No credentials found', { loginUsername, loginPassword });
        Alert.alert('Lỗi', 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
        navigation.navigate('Login');
        return;
      }

      try {
        console.log('FaceIDPage: Attempting auto-login with:', { loginUsername });
        const data = await login({ username: loginUsername, password: loginPassword });
        console.log('FaceIDPage: Login response:', {
          success: data.success,
          user: data.user ? { name: data.user.name, account_number: data.user.account_number, balance: data.user.balance } : null,
          message: data.message,
        });

        if (data.success) {
          setname(data.user.name || '');
          setAccountNumber?.(data.user.account_number || undefined);
          setBalance?.(data.user.balance);
          setIsAuthenticated(true);
          setUsername(loginUsername);
          setPassword(loginPassword);

          const authData = {
            username: loginUsername,
            password: loginPassword,
            name: data.user.name || '',
            account_number: data.user.account_number || undefined,
            balance: data.user.balance !== undefined ? data.user.balance / 100 : undefined,
            isAuthenticated: true,
          };
          await AsyncStorage.setItem('authData', JSON.stringify(authData));
          console.log('FaceIDPage: Saved auth data to AsyncStorage:', authData);

          const authStatus = await messaging().requestPermission({
            alert: true,
            badge: true,
            sound: true,
            provisional: true,
          });
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled && loginUsername) {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
              try {
                console.log('FaceIDPage: Sending FCM token to server:', { loginUsername, fcmToken });
                const response = await fetch('http://51.79.181.161:5000/save-token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: loginUsername, fcmToken }),
                });
                const result = await response.json();
                console.log('FaceIDPage: Save token response:', result);
                if (!result.success) {
                  console.warn('FaceIDPage: Failed to save FCM token:', result.message);
                }
              } catch (error) {
                console.error('FaceIDPage: Error sending FCM token:', error);
              }
            }
          }

          console.log('FaceIDPage: Auto-login successful, navigating to Home');
          navigation.navigate('Home');
        } else {
          throw new Error(data.message || 'Đăng nhập thất bại');
        }
      } catch (error) {
        console.error('FaceIDPage: Auto-login error:', error);
        Alert.alert(
          'Lỗi',
          (error as Error).message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.'
        );
        navigation.navigate('Login');
      }
    }, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    navigation,
    username,
    password,
    setname,
    setAccountNumber,
    setBalance,
    setIsAuthenticated,
    setUsername,
    setPassword,
  ]);

  const cameraSectionHeight = deviceHeight * 0.65;
  const outerOvalWidth = 380;
  const outerOvalHeight = 460;
  const scanOvalWidth = outerOvalWidth * 0.92;
  const scanOvalHeight = outerOvalHeight * 0.92;

  // Chu vi ước lượng (Ramanujan)
  const a = scanOvalWidth / 2;
  const b = scanOvalHeight / 2;
  const circumference = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  const arcLength = circumference * 0.25;

  // Animation offset
  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withRepeat(
      withTiming(circumference, {
        duration: 800,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [circumference]);

  const animatedProps1 = useAnimatedProps(() => {
    return {
      strokeDashoffset: -(offset.value % circumference),
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    return {
      strokeDashoffset: -((offset.value + circumference / 2) % circumference),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { height: deviceHeight * 0.15 }]}>
        <Image source={require('../image/logoP1.png')} style={styles.logo} />
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => console.log('Settings icon pressed')}
        >
          <Icon name="info" size={24} color="#141635" />
        </TouchableOpacity>
        <Text style={styles.instructionText}>Mặt đúng vị trí. Giữ vững tay</Text>
      </View>

      {/* Main camera */}
      <View
        style={{
          height: cameraSectionHeight,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {device && checkCamera && isCameraReady ? (
          <Camera
            style={{ width: deviceWidth, height: cameraSectionHeight }}
            device={device}
            isActive={appStateStatus === 'active'}
            enableZoomGesture
            onError={(error) => console.log('Camera error:', error)}
          />
        ) : (
          <Text style={styles.cameraPlaceholderText}>Đang tải camera...</Text>
        )}

        {/* Overlay */}
        <Svg height={cameraSectionHeight} width={deviceWidth} style={StyleSheet.absoluteFill}>
          <Defs>
            <Mask id="mask" x="0" y="0" height="100%" width="100%">
              <Rect height="100%" width="100%" fill="white" />
              <Ellipse
                cx={deviceWidth / 2}
                cy={cameraSectionHeight / 2}
                rx={outerOvalWidth / 2}
                ry={outerOvalHeight / 2}
                fill="black"
              />
            </Mask>
          </Defs>

          {/* Background mờ */}
          <Rect
            height="100%"
            width="100%"
            fill="rgba(154,142,154, 0.9)"
            mask="url(#mask)"
          />

          {/* Viền oval lớn */}
          <Ellipse
            cx={deviceWidth / 2}
            cy={cameraSectionHeight / 2}
            rx={outerOvalWidth / 2}
            ry={outerOvalHeight / 2}
            stroke="#141635"
            strokeWidth={3}
            fill="transparent"
          />

          {/* 2 đoạn cung oval nhỏ chạy đối xứng */}
          <AnimatedEllipse
            animatedProps={animatedProps1}
            cx={deviceWidth / 2}
            cy={cameraSectionHeight / 2}
            rx={scanOvalWidth / 2}
            ry={scanOvalHeight / 2}
            stroke="rgba(0,51,102, 0.5)"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            fill="transparent"
          />
          <AnimatedEllipse
            animatedProps={animatedProps2}
            cx={deviceWidth / 2}
            cy={cameraSectionHeight / 2}
            rx={scanOvalWidth / 2}
            ry={scanOvalHeight / 2}
            stroke="rgba(0,51,102, 0.5)"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference - arcLength}`}
            fill="transparent"
          />
        </Svg>

        {/* Logo dưới oval */}
        <View style={styles.labelContainer}>
          <Image
            source={require('../image/digiBank.png')}
            style={styles.labelImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { height: deviceHeight * 0.2 }]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  logo: { width: 120, height: 40, marginTop: 10 },
  settingsIcon: { position: 'absolute', top: 15, right: 20 },
  instructionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#141635',
    textAlign: 'center',
    marginTop: 30,
  },
  cameraPlaceholderText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  footer: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  labelContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(154,142,154, 0.9)',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  labelImage: { width: 100, height: 30 },
});

export default FaceIDPage;