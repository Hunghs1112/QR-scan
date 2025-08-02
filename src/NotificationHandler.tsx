import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import NotifService from './utils/NotifService';
import { useAuth } from './Context/AuthContext';

const NotificationHandler: React.FC = () => {
  const [lastTransactionTime, setLastTransactionTime] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadLastTransactionTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('lastTransactionTime');
        console.log('NotificationHandler.loadLastTransactionTime: Loaded last transaction time', { storedTime });
        if (storedTime) {
          setLastTransactionTime(storedTime);
        }
      } catch (error) {
        console.error('NotificationHandler.loadLastTransactionTime: Error', error);
      }
    };
    loadLastTransactionTime();
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log('NotificationHandler.requestNotificationPermission: Requesting POST_NOTIFICATIONS permission');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('NotificationHandler.requestNotificationPermission: Permission result', { granted });
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('NotificationHandler.requestNotificationPermission: Permission denied');
          return false;
        }
      }
      return true;
    };

    const createChannels = async () => {
      if (Platform.OS !== 'android') {
        console.log('NotificationHandler.createChannels: Skipping channel creation for non-Android platform');
        return;
      }

      try {
        PushNotification.getChannels((channels) => {
          console.log('NotificationHandler.createChannels: Existing channels', { channels });
          if (!channels.includes('transaction-channel')) {
            console.log('NotificationHandler.createChannels: Creating transaction-channel');
            PushNotification.createChannel(
              {
                channelId: 'transaction-channel',
                channelName: 'Transaction Notifications',
                channelDescription: 'Notifications for transaction updates',
                importance: Importance.HIGH,
                vibrate: true,
                playSound: true,
                soundName: 'default',
                priority: 'high',
              } as any,
              (created) => console.log('NotificationHandler.createChannels: transaction-channel created', { created })
            );
          }

          if (!channels.includes('remote-channel')) {
            console.log('NotificationHandler.createChannels: Creating remote-channel');
            PushNotification.createChannel(
              {
                channelId: 'remote-channel',
                channelName: 'Remote Notifications',
                channelDescription: 'Notifications received from the server',
                importance: Importance.HIGH,
                vibrate: true,
                playSound: true,
                soundName: 'default',
                priority: 'high',
              } as any,
              (created) => console.log('NotificationHandler.createChannels: remote-channel created', { created })
            );
          }
        });
      } catch (error) {
        console.error('NotificationHandler.createChannels: Error', error);
      }
    };

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NotificationHandler.onNotification: Received notification', {
          foreground: notification.foreground,
          title: (notification.data as any)?.title,
          message: notification.message,
          data: notification.data,
          userInteraction: notification.userInteraction,
          isAuthenticated,
        });
        NotifService.handleRemoteNotification(notification, { isAuthenticated });
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log('NotificationHandler.onAction: Notification action triggered', { notification });
      },
      onRegistrationError: function (err) {
        console.error('NotificationHandler.onRegistrationError: Error', err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: false,
    });

    const setupNotifications = async () => {
      console.log('NotificationHandler.setupNotifications: Starting setup');
      const granted = await requestNotificationPermission();
      console.log('NotificationHandler.setupNotifications: Permission granted', { granted });
      if (granted) {
        await createChannels();
      }
      console.log('NotificationHandler.setupNotifications: Setup completed');
    };
    setupNotifications();
  }, [isAuthenticated]);

  return null;
};

export default NotificationHandler;