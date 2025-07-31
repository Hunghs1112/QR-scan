import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useAuth } from './Context/AuthContext';
import App from './screen/QrPage/QRPage';
import Two from './PaymentScreen/Two';
import Three from './BankScreen/Three';
import Five from './screen/SuccessScreen/Five';
import One from './HomeScreen/One';
import LoginScreen from './screen/Login/LoginScreen';
import MainScreen from './screen/MainScreen/MainScreen';
import Four from './ConfirmScreen/Four';
import TransactionHistory from './screen/Transaction/TransactionHistory';

// Define the type for your navigation stack
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Home: undefined;
  Payment: undefined;
  Bank: undefined;
  QRPage: undefined;
  Bill: undefined;
  Confirm: undefined;
  Demo: undefined;
  History: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Main' : 'Login'}
      screenOptions={{
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: 'Main Screen',
        }}
      />
      <Stack.Screen
        name="Home"
        component={One}
        options={{
          title: 'Trang chủ',
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Two}
        options={{
          title: 'Thanh toán',
        }}
      />
      <Stack.Screen
        name="Bank"
        component={Three}
        options={{
          title: 'Chọn tài khoản',
        }}
      />
      <Stack.Screen
        name="QRPage"
        component={App}
        options={{
          title: 'Quét QR',
        }}
      />
      <Stack.Screen
        name="Bill"
        component={Five}
        options={{
          title: 'Hóa đơn',
        }}
      />
      <Stack.Screen
        name="Confirm"
        component={Four}
        options={{
          title: 'Xác nhận thanh toán',
        }}
      />
      <Stack.Screen
        name="History"
        component={TransactionHistory}
        options={{
          title: 'Xác nhận thanh toán',
        }}
      />
    </Stack.Navigator>
  );
};

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigation;