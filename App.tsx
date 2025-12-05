import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { AuthProvider } from './src/Context/AuthContext';
import { BankProvider } from './src/Context/BankContext';
import { TransactionProvider } from './src/Context/TransactionContext';
import { UserProvider } from './src/Context/UserContext';
import { LoadingProvider, useLoading } from './src/Context/LoadingContext'; // Import LoadingProvider
import Navigation from './src/Navigation';
import IsLoading from './src/isLoading'; // Import IsLoading component

/**
 * Custom hook để cấu hình FCM + Local Notification cho iOS & Android
 */
const useNotifications = () => {
  // Hàm hiển thị Local Notification cho iOS
  const showLocalNotificationIOS = async (remoteMessage: any) => {
    try {
      await PushNotificationIOS.addNotificationRequest({
        id: new Date().getTime().toString(),
        title:
          remoteMessage?.notification?.title ||
          remoteMessage?.data?.title ||
          'Thông báo',
        body:
          remoteMessage?.notification?.body ||
          remoteMessage?.data?.body ||
          'Bạn có thông báo mới',
        userInfo: remoteMessage?.data || {},
        sound: 'default',
      });
      console.log('iOS Local Notification Sent ✅');
    } catch (error) {
      console.error('Error sending iOS local notification:', error);
    }
  };

  // Cấu hình local notification cho Android
  useEffect(() => {
    PushNotification.configure({
      onNotification: (notification) => {
        console.log('Local notification:', notification);
        if (notification.finish) {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  // Lắng nghe tin nhắn từ FCM
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground FCM message:', remoteMessage);
      showLocalNotificationIOS(remoteMessage);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened from background:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification opened from killed state:', remoteMessage);
        }
      });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('FCM background message:', remoteMessage);
      showLocalNotificationIOS(remoteMessage);
    });

    return () => {
      unsubscribe();
    };
  }, []);
};

const App = () => {
  useNotifications();
  const { isLoading } = useLoading(); // Sử dụng useLoading để lấy trạng thái isLoading

  return (
    <LoadingProvider> {/* Bọc tất cả các Provider bằng LoadingProvider */}
      <AuthProvider>
        <UserProvider>
          <BankProvider>
            <TransactionProvider>
              <Navigation />
              <IsLoading visible={isLoading} /> {/* Hiển thị IsLoading khi isLoading là true */}
            </TransactionProvider>
          </BankProvider>
        </UserProvider>
      </AuthProvider>
    </LoadingProvider>
  );
};

export default App;