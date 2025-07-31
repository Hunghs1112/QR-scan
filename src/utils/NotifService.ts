import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class NotifService {
  constructor() {}

  handleRemoteNotification = (
    notification: {
      foreground: any;
      title: any;
      message: any;
      data: { transactionId?: string; type?: string };
      userInteraction: any;
    },
    authContext: { isAuthenticated: boolean }
  ) => {
    if (!authContext.isAuthenticated) {
      return;
    }
    if (notification.foreground) {
      PushNotification.localNotification({
        channelId: 'remote-channel',
        title: notification.title || 'Thông báo từ Server',
        message: notification.message || 'Bạn đã nhận được một thông báo từ server!',
        userInfo: notification.data || {},
        playSound: true,
        soundName: 'default',
        importance: 'high',
        priority: 'high',
        vibrate: true,
        autoCancel: true,
        showWhen: true,
      });
    } else if (notification.userInteraction) {
      const { transactionId, type } = notification.data || {};
      if (type === 'transaction') {
      }
    }
  };

  sendTokenToServer = async (token: string, authContext: any, retries = 3, delay = 1000) => {
    const { isAuthenticated, username } = authContext;
    if (!isAuthenticated || !username) {
      return;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch('http://51.79.181.161:5000/save-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            fcmToken: token,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  };

  clearNotifications = () => {
    PushNotification.cancelAllLocalNotifications?.();
    PushNotification.abandonPermissions?.();
  };

  sendLocalNotification(title: string, message: string) {
    PushNotification.localNotification({
      channelId: 'transaction-channel',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      autoCancel: true,
      showWhen: true,
    });
  }
}

export default new NotifService();