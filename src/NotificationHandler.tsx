import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const NotificationHandler: React.FC = () => {
  const [lastTransactionTime, setLastTransactionTime] = useState<string | null>(null);

  useEffect(() => {
    const loadLastTransactionTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('lastTransactionTime');
        if (storedTime) {
          setLastTransactionTime(storedTime);
        }
      } catch (error) {
      }
    };
    loadLastTransactionTime();
  }, []);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return false;
        }
      }
      return true;
    };

    const createChannels = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        PushNotification.getChannels((channels) => {
          if (!channels.includes('transaction-channel')) {
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
              () => {}
            );
          }

          if (!channels.includes('remote-channel')) {
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
              () => {}
            );
          }
        });
      } catch (error) {
      }
    };

    PushNotification.configure({
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
      },
      onRegistrationError: function (err) {
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
      const granted = await requestNotificationPermission();
      if (granted) {
        await createChannels();
      }
    };
    setupNotifications();
  }, []);

  return null;
};

export default NotificationHandler;