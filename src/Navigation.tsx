// Navigation.tsx
import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './Context/AuthContext';

// Import screens
import App from './screen/QrPage/QRPage';
import Two from './PaymentScreen/Two';
import Three from './BankScreen/Three';
import Five from './screen/SuccessScreen/Five';
import One from './HomeScreen/One';
import LoginScreen from './screen/Login/LoginScreen';
import MainScreen from './screen/MainScreen/MainScreen';
import Four from './ConfirmScreen/Four';
import TransactionHistory from './screen/Transaction/TransactionHistory';

// Define navigation params
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screens config
const persistentScreens = [
  { name: 'Login', component: LoginScreen, title: 'Login' },
  { name: 'Main', component: MainScreen, title: 'Main Screen' },
  { name: 'Home', component: One, title: 'Trang chủ' },
  { name: 'History', component: TransactionHistory, title: 'Lịch sử giao dịch' },
];

const temporaryScreens = [
  { name: 'Payment', component: Two, title: 'Thanh toán' },
  { name: 'Bank', component: Three, title: 'Chọn tài khoản' },
  { name: 'QRPage', component: App, title: 'Quét QR' },
  { name: 'Bill', component: Five, title: 'Hóa đơn' },
  { name: 'Confirm', component: Four, title: 'Xác nhận thanh toán' },
];

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const initialRoute = useMemo(
    () => (isAuthenticated ? 'Main' : 'Login'),
    [isAuthenticated]
  );

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
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

      {temporaryScreens.map(({ name, component, title }) => (
        <Stack.Screen
          key={name}
          name={name as keyof RootStackParamList}
          component={component}
          options={{
            title,
            
          }}
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
