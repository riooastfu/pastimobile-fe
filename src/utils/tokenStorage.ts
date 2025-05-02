import EncryptedStorage from "react-native-encrypted-storage";

export const storeTokens = async (accessToken: string, refreshToken: string) => {
    await EncryptedStorage.setItem('accessToken', accessToken);
    await EncryptedStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = async () => {
    return await EncryptedStorage.getItem('accessToken');
};

export const getRefreshToken = async () => {
    return await EncryptedStorage.getItem('refreshToken');
};

export const removeTokens = async () => {
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('refreshToken');
};