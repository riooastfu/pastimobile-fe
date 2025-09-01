import api from "../services/api";

export const updateFcmToken = async (fcmToken: string) => {
  const response = await api.post('/notification/update-token', {
    fcm_token: fcmToken
  });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get('/notification/list');
  return response.data;
};