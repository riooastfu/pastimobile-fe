import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { getAccessToken, getRefreshToken, removeTokens, storeTokens } from '../utils/tokenStorage';

interface JwtPayload {
    exp: number;
    id: number;
    id_role: number;
    namauser: string;
}

type AuthType = {
    onLogin: (username: string, password: string) => Promise<boolean>;
    onLogout: () => Promise<void>;
    refreshSession: () => Promise<boolean>;
    msg: string,
    setMsg: React.Dispatch<React.SetStateAction<string>>
    userToken: string,
    userData: User,
    isLoading: boolean
}

// Default empty user data
const emptyUserData: User = {
    namauser: "",
    karyawanid: 0,
    nik_kantor: "",
    pin_absen: 0,
    nama_karyawan: "",
    id_role: 0,
    jabatan: "",
    departemen: "",
    pt: "",
    lokasi: "",
    status: "",
    golongan: "",
};

export const AuthContext = createContext<AuthType>({
    onLogin: async () => false,
    onLogout: async () => { },
    refreshSession: async () => false,
    msg: "",
    setMsg: () => { },
    userToken: "",
    isLoading: false,
    userData: emptyUserData
});

export const AuthProviders = ({ children }: PropsWithChildren) => {
    const [userData, setUserData] = useState<User>(emptyUserData);
    const [userToken, setUserToken] = useState("");
    const [msg, setMsg] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // Check if a token is expired
    const isTokenExpired = (token: string | null): boolean => {
        if (!token) return true;
        try {
            const { exp } = jwtDecode<JwtPayload>(token);
            // Add a buffer of 10 seconds to account for network delays
            return (exp * 1000) < (Date.now() - 10000);
        } catch (e) {
            console.error("Token decode error:", e);
            return true;
        }
    };

    // Try to refresh the session with the refresh token
    const refreshSession = async (): Promise<boolean> => {
        try {
            const refreshToken = await getRefreshToken();

            // If no refresh token or it's expired, we can't refresh
            if (!refreshToken || isTokenExpired(refreshToken)) {
                return false;
            }

            // Attempt to get a new access token
            const response = await api.post('/auth/refresh-token', { refreshToken });
            const { accessToken } = response.data.data;

            // Store the new access token
            await storeTokens(accessToken, refreshToken);
            setUserToken(accessToken);

            return true;
        } catch (error) {
            console.error("Session refresh failed:", error);
            return false;
        }
    };

    const onLogin = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            // Validate inputs
            if (!username || !password) {
                if (!username && !password) {
                    setMsg('*Username dan Password tidak boleh kosong');
                } else if (!username) {
                    setMsg('*Username tidak boleh kosong');
                } else {
                    setMsg('*Password tidak boleh kosong');
                }
                return false;
            }

            // Attempt login
            const res = await api.post('/auth/login', {
                namauser: username,
                password: password,
            });

            const { accessToken, refreshToken, user } = res.data.data;

            // Save user data and tokens
            await AsyncStorage.setItem('userData', JSON.stringify(user));
            await storeTokens(accessToken, refreshToken);

            setUserData(user);
            setUserToken(accessToken);
            setMsg('');
            return true;
        } catch (error: any) {
            console.error("Login error:", error);
            if (error.response) {
                setMsg(error.response.data.msg || 'Login gagal');
            } else {
                setMsg('Koneksi gagal. Silakan coba lagi.');
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const onLogout = async () => {
        setIsLoading(true);
        try {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                // Use the API instance with proper error handling
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (err) {
            // We don't need to block logout on API errors
            console.log('Logout error (ignored):', err);
        }

        // Clear state and storage regardless of API success
        setUserToken('');
        setUserData(emptyUserData);
        await removeTokens();
        await AsyncStorage.removeItem('userData');
        setIsLoading(false);
    };

    const initializeAuth = async () => {
        setIsLoading(true);
        try {
            // Get stored tokens and user data
            const [userDataStr, accessToken, refreshToken] = await Promise.all([
                AsyncStorage.getItem('userData'),
                getAccessToken(),
                getRefreshToken(),
            ]);

            // If access token is valid, use it
            if (accessToken && !isTokenExpired(accessToken) && userDataStr) {
                setUserToken(accessToken);
                setUserData(JSON.parse(userDataStr));
                return;
            }

            // If access token is expired but refresh token is valid, try to refresh
            if (refreshToken && !isTokenExpired(refreshToken)) {
                const refreshed = await refreshSession();
                if (refreshed && userDataStr) {
                    setUserData(JSON.parse(userDataStr));
                    return;
                }
            }

            // If we get here, we couldn't restore the session
            await onLogout();
        } catch (error) {
            console.error('Auth initialization error:', error);
            await onLogout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            onLogin,
            onLogout,
            refreshSession,
            msg,
            setMsg,
            userToken,
            isLoading,
            userData
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);