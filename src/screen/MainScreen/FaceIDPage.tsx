import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Svg, { Defs, Mask, Rect, Ellipse } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';
import { useAuth } from '../../Context/AuthContext';
import { login } from '../../utils/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Confirm: { success?: boolean };
  FaceID: undefined;
};

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const FaceIDPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [checkCamera, setCheckCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFirstPhase, setIsFirstPhase] = useState(true);
  const appState = useRef(AppState.currentState);
  const [appStateStatus, setAppStateStatus] = useState(appState.current);
  const device = useCameraDevices().find((d) => d.position === 'front');

  const { username, password, setname, setAccountNumber, setBalance, setIsAuthenticated, setUsername, setPassword } = useAuth();

  // Xin quyền camera
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status !== 'denied') setCheckCamera(true);
    })();
  }, []);

  // Bật camera
  useEffect(() => {
    if (!device || !checkCamera) return;
    const readyTimer = setTimeout(() => setIsCameraReady(true), 300);
    return () => clearTimeout(readyTimer);
  }, [device, checkCamera]);

  // AppState
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== appState.current) {
        appState.current = nextAppState;
        setAppStateStatus(nextAppState);
      }
    });
    return () => subscription.remove();
  }, []);

  // Auto-login + phase
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 2500) setIsFirstPhase(false);
      if (elapsed > 4000) {
        clearInterval(interval);

        let loginUsername = username;
        let loginPassword = password;

        if (!loginUsername || !loginPassword) {
          try {
            const storedAuth = await AsyncStorage.getItem('authData');
            if (storedAuth) {
              const authData = JSON.parse(storedAuth);
              loginUsername = authData.username || loginUsername;
              loginPassword = authData.password || '';
            }
          } catch (error) {
            console.error('Error reading authData:', error);
          }
        }

        if (!loginUsername || !loginPassword) {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
          navigation.navigate('Login');
          return;
        }

        try {
          const data = await login({ username: loginUsername, password: loginPassword });
          if (data.success) {
            setname(data.user.name || '');
            setAccountNumber?.(data.user.account_number);
            setBalance?.(data.user.balance);
            setIsAuthenticated(true);
            setUsername(loginUsername);
            setPassword(loginPassword);

            await AsyncStorage.setItem(
              'authData',
              JSON.stringify({ username: loginUsername, password: loginPassword, name: data.user.name || '', account_number: data.user.account_number, balance: data.user.balance, isAuthenticated: true })
            );

            const authStatus = await messaging().requestPermission({ alert: true, badge: true, sound: true, provisional: true });
            const enabled =
              authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
              authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
              const fcmToken = await messaging().getToken();
              if (fcmToken) {
                try {
                  await fetch('http://51.79.181.161:5000/save-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: loginUsername, fcmToken }),
                  });
                } catch (error) {
                  console.error('Error sending FCM token:', error);
                }
              }
            }

            navigation.navigate('Home');
          } else {
            throw new Error(data.message || 'Đăng nhập thất bại');
          }
        } catch (error) {
          Alert.alert('Lỗi', (error as Error).message || 'Đăng nhập thất bại');
          navigation.navigate('Login');
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [navigation, username, password]);

  // Oval animation
  const cameraSectionHeight = deviceHeight * 0.65;
  const outerOvalWidth = 380;
  const outerOvalHeight = 460;
  const scanOvalWidth = outerOvalWidth * 0.92;
  const scanOvalHeight = outerOvalHeight * 0.92;

  const a = scanOvalWidth / 2;
  const b = scanOvalHeight / 2;
  const circumference = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  const arcLength = circumference * 0.25;

  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withRepeat(withTiming(circumference, { duration: 10000, easing: Easing.linear }), -1, false);
  }, [circumference]);

  // 2 cung tách nhau bằng derived value
  const offset1 = useDerivedValue(() => offset.value % circumference);
  const offset2 = useDerivedValue(() => (offset.value + circumference / 2) % circumference);

  const animatedProps1 = useAnimatedProps(() => ({ strokeDashoffset: -offset1.value }));
  const animatedProps2 = useAnimatedProps(() => ({ strokeDashoffset: -offset2.value }));

  const overlaySvg = useMemo(() => (
    <Svg height={cameraSectionHeight} width={deviceWidth} style={StyleSheet.absoluteFill}>
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="white" />
          <Ellipse cx={deviceWidth / 2} cy={cameraSectionHeight / 2} rx={outerOvalWidth / 2} ry={outerOvalHeight / 2} fill="black" />
        </Mask>
      </Defs>
      <Rect height="100%" width="100%" fill="rgba(154,142,154,0.9)" mask="url(#mask)" />
      <Ellipse
        cx={deviceWidth / 2}
        cy={cameraSectionHeight / 2}
        rx={outerOvalWidth / 2}
        ry={outerOvalHeight / 2}
        stroke={isFirstPhase ? 'red' : '#141635'}
        strokeWidth={3}
        strokeDasharray={isFirstPhase ? '10,10' : ''}
        fill="transparent"
      />
      <AnimatedEllipse
        animatedProps={animatedProps1}
        cx={deviceWidth / 2}
        cy={cameraSectionHeight / 2}
        rx={scanOvalWidth / 2}
        ry={scanOvalHeight / 2}
        stroke="rgba(0,51,102,0.5)"
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
        stroke="rgba(0,51,102,0.5)"
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={`${arcLength} ${circumference - arcLength}`}
        fill="transparent"
      />
    </Svg>
  ), [isFirstPhase, cameraSectionHeight, arcLength, circumference]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { height: deviceHeight * 0.15 }]}>
        <Image source={require('../image/logoP1.png')} style={styles.logo} />
        <TouchableOpacity style={styles.settingsIcon}>
          <Icon name="info" size={24} color="#141635" />
        </TouchableOpacity>
        <Text style={[styles.instructionText, { color: isFirstPhase ? 'red' : '#141635' }]}>
          {isFirstPhase ? 'Vui lòng đưa mặt vào giữa khung hình' : 'Mặt đúng vị trí. Giữ vững tay'}
        </Text>
      </View>

      <View style={{ height: cameraSectionHeight, width: '100%', position: 'relative', overflow: 'hidden' }}>
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

        {overlaySvg}

        <View style={styles.labelContainer}>
          <Image source={require('../image/digiBank.png')} style={styles.labelImage} resizeMode="contain" />
        </View>
      </View>

      <View style={[styles.footer, { height: deviceHeight * 0.2 }]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  logo: { width: 120, height: 40, marginTop: 10 },
  settingsIcon: { position: 'absolute', top: 15, right: 20 },
  instructionText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 30 },
  cameraPlaceholderText: { color: '#fff', fontSize: 16, textAlign: 'center', paddingHorizontal: 20, alignSelf: 'center', marginTop: 20 },
  footer: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  labelContainer: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'rgba(154,142,154,0.9)', borderRadius: 10, paddingVertical: 4, paddingHorizontal: 8 },
  labelImage: { width: 100, height: 30 },
});

export default FaceIDPage;
