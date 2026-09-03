import {api} from "../api.ts";
import type {LoginRequest} from "../../types/request/login.ts";
import type {RegisterRequest} from "../../types/request/register.ts";
import type {AuthResponse} from "../../types/response/auth.ts";
import type {ApiResponse} from "../../types/response/api.ts";

export const AuthService = {
    async login(payload: LoginRequest) {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
        return response.data.data;
    },

    async register(payload: RegisterRequest) {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
        return response.data.data;
    },

    async refresh() {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");
        return response.data.data;
    },
};
