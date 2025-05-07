import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, removeTokens, storeTokens } from "../utils/tokenStorage";
import { baseurl } from "../helpers/baseurl";

// Flag to prevent multiple refresh attempts at once
let isRefreshing = false;
// Queue of requests to retry after token refresh
let refreshSubscribers: Array<(token: string) => void> = [];

// Add a callback to the queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Execute all callbacks with the new token
const onRefreshed = (token: string) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

const api: AxiosInstance = axios.create({
    baseURL: baseurl,
    timeout: 10000, // Adding a reasonable timeout
});

// === Interceptor for requests ===
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getAccessToken();
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
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

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
                const refreshToken = await getRefreshToken();

                if (!refreshToken) {
                    // No refresh token available, need to login again
                    throw new Error("No refresh token available");
                }

                // Try to get a new access token
                const response = await axios.post(
                    `${baseurl}/auth/refresh-token`,
                    { refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const { accessToken } = response.data.data;

                // Store the new token
                await storeTokens(accessToken, refreshToken);

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
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);

                // Reset refreshing state
                isRefreshing = false;

                // Clear tokens and notify subscribers of failure
                await removeTokens();

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