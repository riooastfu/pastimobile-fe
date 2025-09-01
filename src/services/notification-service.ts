import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import api from './api';

class NotificationService {
  async requestPermission() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }

  async getToken() {
    return await messaging().getToken();
  }

  async registerToken() {
    try {
      console.log('🔔 Getting FCM token...');
      const token = await this.getToken();
      console.log('🔔 FCM Token:', token?.substring(0, 20) + '...');

      console.log('🔔 Registering token with backend...');
      const response = await api.post('/auth/register-fcm-token', {
        fcmToken: token,
        platform: 'android'
      });
      console.log('🔔 Backend response:', response.data);

      return token;
    } catch (error: any) {
      console.error('🔔 Failed to register FCM token:', error);
      console.error('🔔 Error details:', error.response?.data);
    }
  }

  onMessage(callback: (message: any) => void) {
    return messaging().onMessage(callback);
  }

  onNotificationOpenedApp(callback: (message: any) => void) {
    return messaging().onNotificationOpenedApp(callback);
  }

  async getInitialNotification() {
    return await messaging().getInitialNotification();
  }
}

export default new NotificationService();