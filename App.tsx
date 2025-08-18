import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { AppRegistry } from 'react-native';
import { PushNotificationIOS } from 'react-native';
import { AuthProvider } from './src/Context/AuthContext';
import { BankProvider } from './src/Context/BankContext';
import { TransactionProvider } from './src/Context/TransactionContext';
import { UserProvider } from './src/Context/UserContext';
import { LoadingProvider } from './src/Context/LoadingContext';
import Navigation from './src/Navigation';
import { name as appName } from './app.json';

interface RemoteMessage {
  notification?: { title?: string; body?: string };
  data?: { [key: string]: any };
  [key: string]: any;
}

const showLocalNotification = (remoteMessage: RemoteMessage) => {
  console.log('Calling showLocalNotification with:', remoteMessage);
  PushNotification.localNotification({
    channelId: 'remote-channel',
    title: remoteMessage?.notification?.title || remoteMessage?.data?.title || 'Thông báo',
    message: remoteMessage?.notification?.body || remoteMessage?.data?.body || 'Bạn có thông báo mới',
    userInfo: remoteMessage.data || {},
    playSound: true,
    soundName: 'default',
    importance: 'high' as const,
    priority: 'high' as const,
    vibrate: true,
    visibility: 'public' as const,
  });
};

PushNotification.configure({
  onNotification: (notification: any) => {
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

messaging().setBackgroundMessageHandler(async (remoteMessage: RemoteMessage) => {
  console.log('FCM background message:', remoteMessage);
  if (!remoteMessage.notification) {
    showLocalNotification(remoteMessage);
  }
});

const App: React.FC = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage: RemoteMessage) => {
      console.log('Foreground FCM message:', remoteMessage);
      showLocalNotification(remoteMessage);
    });

    messaging().onNotificationOpenedApp((remoteMessage: RemoteMessage) => {
      console.log('Notification opened from background:', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage: RemoteMessage | null) => {
        if (remoteMessage) {
          console.log('Notification opened from killed state:', remoteMessage);
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
            <LoadingProvider>
              <Navigation />
            </LoadingProvider>
          </TransactionProvider>
        </BankProvider>
      </UserProvider>
    </AuthProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);

export default App;