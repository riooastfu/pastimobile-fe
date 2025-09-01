import React, { PropsWithChildren, createContext, createRef, useContext, useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { tokenStorage } from '../utils/secure-storage';
import { logger } from '../utils/logger';
import axios from 'axios';
import { ENV } from '../config/environment';

const baseurl = ENV.API_BASE_URL;
import { NavigationContainerRef } from '@react-navigation/native';
import { AppState } from 'react-native';
import { createLogUserLogin } from '../api/auth';
import { useLoading } from '../hooks/use-loading';

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
    onPasswordReset: () => Promise<void>;
    msg: string,
    setMsg: React.Dispatch<React.SetStateAction<string>>
    userToken: string,
    userData: User,
    isPasswordExpired: boolean
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
    onPasswordReset: async () => { },
    msg: "",
    setMsg: () => { },
    userToken: "",
    userData: emptyUserData,
    isPasswordExpired: false
});

// Create a navigation reference
export const navigationRef = createRef<NavigationContainerRef<any>>();

// Export a navigation function
export function navigate(name: string, params?: any) {
    if (navigationRef.current) {
        navigationRef.current.navigate(name, params);
    }
}

export const AuthProviders = ({ children }: PropsWithChildren) => {
    const { isLoading, showLoading, hideLoading } = useLoading();

    const [userData, setUserData] = useState<User>(emptyUserData);
    const [userToken, setUserToken] = useState("");
    const [msg, setMsg] = useState<string>("");
    const [isPasswordExpired, setIsPasswordExpired] = useState<boolean>(false);
    const appState = useRef(AppState.currentState);

    // Check if a token is expired
    const isTokenExpired = (token: string | null): boolean => {
        if (!token) return true;
        try {
            const { exp } = jwtDecode<JwtPayload>(token);
            // Reduced buffer to 5 seconds to prevent premature expiration
            return (exp * 1000) < (Date.now() + 5000);
        } catch (e) {
            console.error("Token decode error:", e);
            return true;
        }
    };

    // Try to refresh the session with the refresh token
    const refreshSession = async (): Promise<boolean> => {
        try {
            const refreshToken = await tokenStorage.getRefreshToken();

            // If no refresh token or it's expired, we can't refresh
            if (!refreshToken) {
                logger.warn("No refresh token available for session refresh");
                return false;
            }

            if (isTokenExpired(refreshToken)) {
                logger.warn("Refresh token is expired");
                return false;
            }

            // Attempt to get a new access token
            const response = await axios.post(`${baseurl}/auth/refresh-token`, { refreshToken });
            const { accessToken } = response.data.data;

            const userData = await tokenStorage.getUserData() || {};
            if (userData.namauser) {
                await createLogUserLogin(userData.namauser);
            }

            // Store the new access token
            await tokenStorage.storeTokens(accessToken, refreshToken);
            setUserToken(accessToken);

            logger.info("Session refreshed successfully");
            return true;
        } catch (error: any) {
            logger.error("Session refresh failed", {
                error: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            return false;
        }
    };

    const onLogin = async (username: string, password: string): Promise<boolean> => {
        showLoading();
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
            const res = await axios.post(`${baseurl}/auth/login`, {
                namauser: username,
                password: password,
            });

            const { accessToken, refreshToken, user } = res.data.data;

            // Check if password is expired
            if (user.passwordExpired) {
                await AsyncStorage.setItem('passwordExpired', 'true');
            } else {
                await AsyncStorage.removeItem('passwordExpired');
            }

            // Save user data and tokens and insert log login to user_log
            await createLogUserLogin(username);
            await tokenStorage.storeUserData(user);
            await tokenStorage.storeTokens(accessToken, refreshToken);

            setUserData(user);
            setUserToken(accessToken);
            setMsg('');

            // Register FCM token after successful login
            try {
                const notificationService = await import('../services/notification-service');
                await notificationService.default.registerToken();
            } catch (error) {
                console.warn('FCM token registration failed:', error);
            }

            return true;
        } catch (error: any) {
            logger.error('Login failed', error);
            if (error.response) {
                setMsg(error.response.data.message || 'Login gagal');
            } else {
                setMsg('Koneksi gagal. Silakan coba lagi.');
            }
            return false;
        } finally {
            hideLoading();
        }
    };

    const onLogout = async () => {
        showLoading();
        try {
            const refreshToken = await tokenStorage.getRefreshToken();
            if (refreshToken) {
                // Use the API instance with proper error handling
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (err) {
            // We don't need to block logout on API errors
            logger.warn('Logout API error (ignored)', err);
        }

        // Clear state and storage regardless of API success
        setUserToken('');
        setUserData(emptyUserData);
        await tokenStorage.removeTokens();
        await tokenStorage.removeUserData();
        await AsyncStorage.removeItem('passwordExpired');
        hideLoading();
    };

    const initializeAuth = async () => {
        showLoading();
        try {
            // Get stored tokens and user data
            const [userData, accessToken, refreshToken, passwordExpired] = await Promise.all([
                tokenStorage.getUserData(),
                tokenStorage.getAccessToken(),
                tokenStorage.getRefreshToken(),
                AsyncStorage.getItem('passwordExpired'),
            ]);

            // If no user data, clear everything and logout
            if (!userData) {
                logger.info("No user data found, logging out");
                await onLogout();
                return;
            }

            // If password is expired, we still log in but will force navigation to reset screen
            if (passwordExpired === 'true') {
                setUserToken(accessToken || '');
                setUserData(userData);
                return;
            }

            // If access token is valid, use it
            if (accessToken && !isTokenExpired(accessToken)) {
                logger.info("Using valid access token");
                setUserToken(accessToken);
                setUserData(userData);

                // Background tasks - don't block UI
                Promise.all([
                    createLogUserLogin(userData.namauser).catch(e => logger.warn('Login log failed', e)),
                    import('../services/notification-service')
                        .then(service => service.default.registerToken())
                        .catch(e => logger.warn('FCM registration failed', e))
                ]);

                return;
            }

            // If access token is expired but refresh token is valid, try to refresh
            if (refreshToken && !isTokenExpired(refreshToken)) {
                logger.info("Access token expired, attempting refresh");
                const refreshed = await refreshSession();
                if (refreshed) {
                    setUserData(userData);
                    return;
                }
                logger.warn("Token refresh failed during initialization");
            }

            // If we get here, we couldn't restore the session
            logger.info("Could not restore session, logging out");
            await onLogout();
        } catch (error: any) {
            logger.error('Auth initialization error', error);
            // Don't force logout on network errors during initialization
            if (error.message?.includes('Network') || error.code === 'NETWORK_ERROR') {
                logger.warn('Network error during auth init, keeping current state');
                hideLoading();
                return;
            }
            await onLogout();
        } finally {
            hideLoading();
        }
    };

    const forcePasswordReset = () => {
        if (navigationRef.current) {
            // Reset the navigation state to prevent going back
            navigationRef.current.reset({
                index: 0,
                routes: [{ name: 'ResetPassword', params: { isForced: true } }],
            });
        }
    };

    // Function to check password status
    const checkPasswordExpiration = async () => {
        const status = await AsyncStorage.getItem('passwordExpired');
        const expired = status === 'true';
        setIsPasswordExpired(expired);

        // If expired and we're authenticated, force navigation to reset screen
        if (expired && userToken && navigationRef.current) {
            forcePasswordReset();
        }

        return expired;
    };

    // Track password expiration status
    useEffect(() => {
        if (userToken) {
            checkPasswordExpiration();
        }
    }, [userToken]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App has come to foreground
                if (userToken) {
                    checkPasswordExpiration();
                }
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [userToken]);

    useEffect(() => {
        const checkForceLogout = async () => {
            const shouldForceLogout = await AsyncStorage.getItem('forceLogout');
            if (shouldForceLogout === 'true') {
                // Clear the flag
                await AsyncStorage.removeItem('forceLogout');
                // Perform logout
                await onLogout(); // Ini akan mengatur setUserToken('') yang memicu perubahan di AuthNavigation
            }
        };

        // Check on app state changes
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App has come to foreground
                checkForceLogout();
            }
            appState.current = nextAppState;
        });

        // Check immediately
        checkForceLogout();

        // Check periodically (optional) - reduced frequency
        const interval = setInterval(checkForceLogout, 60000);

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, []);

    // After successful password reset
    const onPasswordReset = async () => {
        await AsyncStorage.removeItem('passwordExpired');
        setIsPasswordExpired(false);
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            onLogin,
            onLogout,
            refreshSession,
            onPasswordReset,
            msg,
            setMsg,
            userToken,
            userData,
            isPasswordExpired
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);