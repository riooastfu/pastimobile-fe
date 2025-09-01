import EncryptedStorage from 'react-native-encrypted-storage';

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error('SecureStorage clear error:', error);
    }
  },
};

export const tokenStorage = {
  async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      secureStorage.setItem(KEYS.ACCESS_TOKEN, accessToken),
      secureStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return secureStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return secureStorage.getItem(KEYS.REFRESH_TOKEN);
  },

  async removeTokens(): Promise<void> {
    await Promise.all([
      secureStorage.removeItem(KEYS.ACCESS_TOKEN),
      secureStorage.removeItem(KEYS.REFRESH_TOKEN),
    ]);
  },

  async storeUserData(userData: any): Promise<void> {
    await secureStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
  },

  async getUserData(): Promise<any | null> {
    const data = await secureStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  async removeUserData(): Promise<void> {
    await secureStorage.removeItem(KEYS.USER_DATA);
  },
};