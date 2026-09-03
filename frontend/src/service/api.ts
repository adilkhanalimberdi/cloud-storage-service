import * as axios from "axios";
import type {AxiosError, InternalAxiosRequestConfig} from "axios";
import {tokenStore} from "./auth/token.store.ts";
import {authEvents} from "./auth/auth.events.ts";
import type {ApiResponse} from "../types/response/api.ts";
import type {AuthResponse} from "../types/response/auth.ts";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
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

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const status = error.response?.status;

        const isRefreshCall = originalRequest?.url === REFRESH_URL;

        if (!originalRequest || status !== 401 || isRefreshCall || originalRequest._retry) {
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
            const response = await api.post<ApiResponse<AuthResponse>>(REFRESH_URL);
            const {accessToken} = response.data.data;

            tokenStore.setAccessToken(accessToken);
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
