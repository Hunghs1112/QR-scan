import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class NotifService {
  constructor() {
    // Create notification channel for Android
    PushNotification.createChannel(
      {
        channelId: 'transaction-channel',
        channelName: 'Transaction Notifications',
        channelDescription: 'Notifications for transaction updates',
        importance: Importance.HIGH,
        vibrate: true,
        playSound: true,
        soundName: 'default',
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    // Configure PushNotification
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  sendLocalNotification(title: string, message: string) {
    PushNotification.localNotification({
      channelId: 'transaction-channel',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      autoCancel: true,
      showWhen: true,
    });
  }
}

export default new NotifService();