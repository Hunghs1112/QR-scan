import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import App from './QRPage';
import Two from './Two';
import Three from './Three';
import Five from './Five';
import One from './One';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import Four from './Four';

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;