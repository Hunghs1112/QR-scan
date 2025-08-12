import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import App from './QrPage/QRPage';
import Two from './PaymentScreen/Two';
import Three from './BankScreen/Three';
import Five from './screen/SuccessScreen/Five';
import One from './HomeScreen/One';
import LoginScreen from './screen/Login/LoginScreen';
import MainScreen from './screen/MainScreen/MainScreen';
import Four from './ConfirmScreen/Four';
import TransactionHistory from './screen/Transaction/TransactionHistory';
import FaceScanPage from './ConfirmScreen/FaceScanPage';
import FaceIDPage from './screen/MainScreen/FaceIDPage';
import SplashScreen from './SplashScreen';

export type RootStackParamList = {
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
  SplashScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const persistentScreens = [
  { name: 'SplashScreen', component: SplashScreen, title: 'Màn chờ' },
  { name: 'Login', component: LoginScreen, title: 'Login' },
  { name: 'Main', component: MainScreen, title: 'Main Screen' },
  { name: 'Home', component: One, title: 'Trang chủ' },
  { name: 'History', component: TransactionHistory, title: 'Lịch sử giao dịch' },
];

const temporaryScreens: Array<{
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  title: string;
  options?: NativeStackNavigationOptions;
}> = [
  { name: 'Payment', component: Two, title: 'Thanh toán' },
  { name: 'Bank', component: Three, title: 'Chọn tài khoản' },
  { name: 'QRPage', component: App, title: 'Quét QR' },
  { name: 'Bill', component: Five, title: 'Hóa đơn' },
  { name: 'Confirm', component: Four, title: 'Xác nhận thanh toán' },
  { name: 'FaceScan', component: FaceScanPage, title: 'Xác thực khuôn mặt' },
  { name: 'FaceID', component: FaceIDPage, title: 'Xác thực Face ID' },
];

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 50,
        contentStyle: { backgroundColor: '#FFF' },
      }}
    >
      {persistentScreens.map(({ name, component, title }) => (
        <Stack.Screen
          key={name}
          name={name as keyof RootStackParamList}
          component={component}
          options={{ title }}
        />
      ))}

      {temporaryScreens.map(({ name, component, title, options }) => (
        <Stack.Screen
          key={name}
          name={name as keyof RootStackParamList}
          component={component}
          options={{ title, ...options }}
        />
      ))}
    </Stack.Navigator>
  );
};

const Navigation: React.FC = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

export default Navigation;