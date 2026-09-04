import {api} from "../api.ts";
import type {AuthResponse, LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest} from "../../types/auth.ts";
import type {ApiResponse} from "../../types/api.ts";

export const AuthService = {
    async login(payload: LoginRequest) {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
        return response.data.data;
    },

    async register(payload: RegisterRequest) {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
        return response.data.data;
    },

    async refresh(refreshToken: string) {
        const payload: RefreshRequest = {refreshToken};
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh", payload);
        return response.data.data;
    },

    async logout(refreshToken: string) {
        const payload: LogoutRequest = {refreshToken};
        await api.post("/auth/logout", payload);
    },
};
