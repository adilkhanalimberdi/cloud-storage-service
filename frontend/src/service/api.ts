import * as axios from "axios";
import type {AxiosError, InternalAxiosRequestConfig} from "axios";
import {tokenStore} from "./auth/token.store.ts";
import {authEvents} from "./auth/auth.events.ts";
import type {ApiResponse} from "../types/api.ts";
import type {AuthResponse} from "../types/auth.ts";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const REFRESH_URL = "/auth/refresh";

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
    const accessToken = tokenStore.getAccessToken();

    if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
});

let isRefreshing = false;
let refreshSubscribers: Array<(accessToken: string | null) => void> = [];

const subscribeToRefresh = (callback: (accessToken: string | null) => void) => {
    refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (accessToken: string | null) => {
    refreshSubscribers.forEach((callback) => callback(accessToken));
    refreshSubscribers = [];
};

// Логин/регистрацию/рефреш/логаут никогда не ретраим через этот механизм -
// иначе, например, 401 на неверный пароль при логине попытался бы "обновить" сессию.
const isAuthEndpoint = (url: string) =>
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout");

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const status = error.response?.status;
        const url = originalRequest?.url ?? "";

        if (!originalRequest || status !== 401 || isAuthEndpoint(url) || originalRequest._retry) {
            return Promise.reject(error);
        }

        const refreshToken = tokenStore.getRefreshToken();

        if (!refreshToken) {
            tokenStore.clear();
            authEvents.emitUnauthorized();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                subscribeToRefresh((accessToken) => {
                    if (!accessToken) {
                        reject(error);
                        return;
                    }

                    originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
                    resolve(api(originalRequest));
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await api.post<ApiResponse<AuthResponse>>(REFRESH_URL, {refreshToken});
            const {accessToken, refreshToken: newRefreshToken} = response.data.data;

            tokenStore.setTokens(accessToken, newRefreshToken);
            notifyRefreshSubscribers(accessToken);

            originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
            return api(originalRequest);
        } catch (refreshError) {
            tokenStore.clear();
            notifyRefreshSubscribers(null);
            authEvents.emitUnauthorized();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
