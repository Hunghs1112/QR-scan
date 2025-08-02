import PushNotification, { Importance, ReceivedNotification } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

interface AuthContext {
  isAuthenticated: boolean;
}

class NotifService {
  constructor() {}

  handleRemoteNotification = (
    notification: Omit<ReceivedNotification, 'userInfo'>,
    authContext: AuthContext
  ) => {
    // Extract title and message from notification.data (FCM data payload) or fallbacks
    const title = (notification.data as any)?.title || 'Thông báo từ Server';
    const message =
      typeof notification.message === 'string'
        ? notification.message
        : (notification.data as any)?.message || notification.message?.toString() || 'Bạn đã nhận được một thông báo từ server!';

    console.log('NotifService.handleRemoteNotification: Received notification', {
      foreground: notification.foreground,
      title,
      message,
      data: notification.data,
      userInteraction: notification.userInteraction,
      isAuthenticated: authContext.isAuthenticated,
    });

    if (!authContext.isAuthenticated) {
      console.log('NotifService.handleRemoteNotification: Skipping notification due to unauthenticated state');
      return;
    }
    if (notification.foreground) {
      console.log('NotifService.handleRemoteNotification: Displaying local notification for foreground');
      PushNotification.localNotification({
        channelId: 'remote-channel',
        title,
        message,
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
      console.log('NotifService.handleRemoteNotification: Handling user interaction', {
        transactionId: (notification.data as any)?.transactionId,
        type: (notification.data as any)?.type,
      });
      const { transactionId, type } = (notification.data as any) || {};
      if (type === 'transaction') {
        console.log('NotifService.handleRemoteNotification: Transaction notification interaction, no action defined');
      }
    }
  };

  sendTokenToServer = async (token: string, authContext: any, retries = 3, delay = 1000) => {
    const { isAuthenticated, username } = authContext;
    console.log('NotifService.sendTokenToServer: Attempting to send token', {
      token,
      isAuthenticated,
      username,
      retries,
    });

    if (!isAuthenticated || !username) {
      console.log('NotifService.sendTokenToServer: Aborting due to missing authentication or username');
      return;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log('NotifService.sendTokenToServer: Sending request, attempt', attempt);
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

        console.log('NotifService.sendTokenToServer: Server response', {
          status: response.status,
          ok: response.ok,
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();
        console.log('NotifService.sendTokenToServer: Success', { result });
        return result;
      } catch (error) {
        console.error('NotifService.sendTokenToServer: Error on attempt', attempt, error);
        if (attempt < retries) {
          console.log('NotifService.sendTokenToServer: Retrying after delay', { delay });
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    console.log('NotifService.sendTokenToServer: All retries failed');
  };

  clearNotifications = () => {
    console.log('NotifService.clearNotifications: Clearing all local notifications');
    PushNotification.cancelAllLocalNotifications?.();
    PushNotification.abandonPermissions?.();
  };

  sendLocalNotification(title: string, message: string) {
    console.log('NotifService.sendLocalNotification: Sending local notification', { title, message });
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