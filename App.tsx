import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { AppRegistry } from 'react-native';
import { PushNotificationIOS } from 'react-native';
import { AuthProvider } from './src/Context/AuthContext';
import { BankProvider } from './src/Context/BankContext';
import { TransactionProvider } from './src/Context/TransactionContext';
import { UserProvider } from './src/Context/UserContext';
import Navigation from './src/Navigation';
import { name as appName } from './app.json';

// Hàm hiển thị thông báo dùng chung
const showLocalNotification = (remoteMessage: any) => {
  console.log('Calling showLocalNotification with:', remoteMessage);
  PushNotification.localNotification({
    channelId: 'remote-channel',
    title: remoteMessage?.notification?.title || remoteMessage?.data?.title || 'Thông báo',
    message: remoteMessage?.notification?.body || remoteMessage?.data?.body || 'Bạn có thông báo mới',
    userInfo: remoteMessage.data || {},
    playSound: true,
    soundName: 'default',
    importance: 'high',
    priority: 'high',
    vibrate: true,
    visibility: 'public',
  });
};

// Cấu hình local notification
PushNotification.configure({
  onNotification: (notification) => {
    console.log('Local notification:', notification);
    if (notification.finish) {
      notification.finish(PushNotificationIOS.FetchResult.NoData); // iOS
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

// Tạo channel Android
PushNotification.createChannel(
  {
    channelId: 'remote-channel',
    channelName: 'Remote Notifications',
    channelDescription: 'Channel for remote FCM notifications',
    importance: 4,
    vibrate: true,
    soundName: 'default',
  },
  (created) => console.log(`Notification channel created: ${created}`),
);

// Background / Killed handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('FCM background message:', remoteMessage);
  if (!remoteMessage.notification) {
    showLocalNotification(remoteMessage);
  }
});

const App = () => {
  useEffect(() => {
    // Foreground message
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground FCM message:', remoteMessage);
      showLocalNotification(remoteMessage); // Luôn gọi showLocalNotification cho mọi message
    });

    // Opened from background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened from background:', remoteMessage);
      // TODO: Navigate or handle logic if needed
    });

    // Opened from killed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification opened from killed state:', remoteMessage);
          // TODO: Navigate or handle logic if needed
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <BankProvider>
          <TransactionProvider>
            <Navigation />
          </TransactionProvider>
        </BankProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;