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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Svg, { Defs, Mask, Rect, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';

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
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const FaceScanPage: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isFirstPhase, setIsFirstPhase] = useState(true);
  const appState = useRef(AppState.currentState);
  const [appStateStatus, setAppStateStatus] = useState(appState.current);

  const device = useCameraDevices().find(d => d.position === 'front');

  // Delay bật camera
  useEffect(() => {
    if (!device) return;
    const timer = setTimeout(() => setIsCameraReady(true), 300);
    return () => clearTimeout(timer);
  }, [device]);

  // Phase và navigation timer gộp
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed > 2500) setIsFirstPhase(false);
      if (elapsed > 5000) {
        navigation.navigate('Confirm', { success: true });
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [navigation]);

  // Lắng nghe trạng thái app
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState !== appState.current) {
        appState.current = nextAppState;
        setAppStateStatus(nextAppState);
      }
    });
    return () => subscription.remove();
  }, []);

  // Kích thước camera & oval
  const cameraSectionHeight = deviceHeight * 0.65;
  const outerOvalWidth = 380;
  const outerOvalHeight = 460;
  const scanOvalWidth = outerOvalWidth * 0.92;
  const scanOvalHeight = outerOvalHeight * 0.92;

  const a = scanOvalWidth / 2;
  const b = scanOvalHeight / 2;
  const circumference = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
  const arcLength = circumference * 0.25;

  // Animation offset tối ưu
  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withRepeat(
      withTiming(circumference, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );
  }, [circumference]);

  // Dùng derivedValue cho 2 cung, tránh 2 animation riêng
  const offset1 = useDerivedValue(() => offset.value % circumference);
  const offset2 = useDerivedValue(() => (offset.value + circumference / 2) % circumference);

  const animatedProps1 = useAnimatedProps(() => ({ strokeDashoffset: -offset1.value }));
  const animatedProps2 = useAnimatedProps(() => ({ strokeDashoffset: -offset2.value }));

  // Memo hóa overlay SVG
  const overlaySvg = useMemo(() => (
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

      <Rect height="100%" width="100%" fill="rgba(154,142,154, 0.9)" mask="url(#mask)" />

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
  ), [isFirstPhase, cameraSectionHeight, arcLength, circumference]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { height: deviceHeight * 0.15 }]}>
        <Image source={require('../screen/image/logoP1.png')} style={styles.logo} />
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => console.log('Settings icon pressed')}
        >
          <Icon name="info" size={24} color="#141635" />
        </TouchableOpacity>
        <Text
          style={[
            styles.instructionText,
            { color: isFirstPhase ? 'red' : '#141635' },
          ]}
        >
          {isFirstPhase
            ? 'Vui lòng đưa mặt vào giữa khung hình'
            : 'Mặt đúng vị trí. Giữ vững tay'}
        </Text>
      </View>

      {/* Camera Section */}
      <View style={{ height: cameraSectionHeight, width: '100%', position: 'relative', overflow: 'hidden' }}>
        {device && isCameraReady && appStateStatus === 'active' ? (
          <Camera
            style={{ width: deviceWidth, height: cameraSectionHeight }}
            device={device}
            isActive={true}
            enableZoomGesture
            onError={(error) => console.log('Camera error:', error)}
          />
        ) : (
          <Text style={styles.cameraPlaceholderText}>Đang tải camera...</Text>
        )}

        {/* Overlay */}
        {overlaySvg}

        {/* Logo dưới oval */}
        <View style={styles.labelContainer}>
          <Image
            source={require('../screen/image/digiBank.png')}
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

export default FaceScanPage;
