import {useEffect} from 'react';
import {Alert} from 'react-native';
import notificationService from '../services/notification-service';

export const useNotifications = () => {
  useEffect(() => {
    // Only handle foreground messages
    const unsubscribe = notificationService.onMessage(message => {
      console.log('🔔 Received foreground message:', message);
      Alert.alert(
        message.notification?.title || 'Notification',
        message.notification?.body || 'You have a new message'
      );
    });

    return unsubscribe;
  }, []);
};