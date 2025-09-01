import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/secure-storage";
import { ENV } from "../config/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "../providers/auth-provider";
import { logger } from "../utils/logger";

type errorProps = {
    errorCode: string;
    status: string;
    statusCode: number
}

interface ApiErrorResponse {
    msg: string;
    error?: errorProps;
    status?: string;
    data?: any;
}

// Flag to prevent multiple refresh attempts at once
let isRefreshing = false;
// Queue of requests to retry after token refresh
let refreshSubscribers: Array<(token: string) => void> = [];
// Cache token to avoid reading from encrypted storage on every request
let cachedToken: string | null = null;

// Add a callback to the queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Execute all callbacks with the new token
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

// Export function to update token cache from outside
export const updateTokenCache = (token: string | null) => {
    cachedToken = token;
};



const api: AxiosInstance = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 10000, // 10 seconds default
    maxRedirects: 3,
    headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
    },
});

// Log API URL on initialization
logger.info('API initialized', { baseURL: ENV.API_BASE_URL });

// === Interceptor for requests ===
api.interceptors.request.use(
    async (config) => {
        try {
            // Use cached token first, fallback to storage if not available
            let token = cachedToken;
            if (!token) {
                token = await tokenStorage.getAccessToken();
                cachedToken = token; // Cache it for next requests
            }
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error("Request interceptor error:", error);
            return config;
        }
    },
    (error) => Promise.reject(error)
);

// === Interceptor for responses ===
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 403 &&
            error.response?.data.error?.errorCode === "PASSWORD_EXPIRED") {
            await AsyncStorage.setItem('passwordExpired', 'true');

            // Import and use the navigation ref to force navigation
            if (navigationRef.current) {
                navigationRef.current.reset({
                    index: 0,
                    routes: [{ name: 'ResetPassword', params: { isForced: true } }],
                });
            }

            return Promise.reject(error);
        }

        // Only attempt refresh if status is 401 (Unauthorized) and we haven't tried before
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If we're already refreshing, wait for the new token
                try {
                    const newToken = await new Promise<string>((resolve) => {
                        addRefreshSubscriber((token: string) => {
                            resolve(token);
                        });
                    });

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }
                    return api(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            // Mark that we're now refreshing
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await tokenStorage.getRefreshToken();

                if (!refreshToken) {
                    // No refresh token available, need to login again
                    throw new Error("No refresh token available");
                }

                // Try to get a new access token
                const response = await axios.post(
                    `${ENV.API_BASE_URL}/auth/refresh-token`,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const { accessToken } = response.data.data;

                // Store the new token and update cache
                await tokenStorage.storeTokens(accessToken, refreshToken);
                cachedToken = accessToken; // Update cache

                // Update the original request with the new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                // Execute queued requests with the new token
                onRefreshed(accessToken);

                // Reset refreshing state
                isRefreshing = false;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError: any) {
                // Reset refreshing state
                isRefreshing = false;

                // Clear tokens and cache
                await tokenStorage.removeTokens();
                cachedToken = null; // Clear cache

                // Only force logout if this isn't a network error during app initialization
                if (!refreshError.message?.includes('Network') && !refreshError.code?.includes('NETWORK')) {
                    await AsyncStorage.setItem('forceLogout', 'true');
                }

                // Reject all pending requests
                refreshSubscribers = [];

                // User needs to login again
                return Promise.reject(new Error("Authentication expired. Please login again."));
            }
        }

        // For errors other than 401, just pass them through
        return Promise.reject(error);
    }
);

export default api;