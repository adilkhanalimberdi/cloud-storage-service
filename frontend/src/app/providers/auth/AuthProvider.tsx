import {useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {AuthProviderContext, type AuthStatus} from "./auth.context.ts";
import {AuthService} from "../../../service/auth/auth.service.ts";
import {tokenStore} from "../../../service/auth/token.store.ts";
import {authEvents} from "../../../service/auth/auth.events.ts";
import type {LoginRequest} from "../../../types/request/login.ts";
import type {RegisterRequest} from "../../../types/request/register.ts";

type AuthProviderProps = {
    children: ReactNode;
};

function AuthProvider({children}: AuthProviderProps) {
    const [status, setStatus] = useState<AuthStatus>(() =>
        tokenStore.getRefreshToken() ? "authenticated" : "unauthenticated"
    );

    useEffect(() => {
        return authEvents.onUnauthorized(() => {
            setStatus("unauthenticated");
        });
    }, []);

    const login = async (payload: LoginRequest) => {
        const {accessToken, refreshToken} = await AuthService.login(payload);
        tokenStore.setTokens(accessToken, refreshToken);
        setStatus("authenticated");
    };

    const register = async (payload: RegisterRequest) => {
        const {accessToken, refreshToken} = await AuthService.register(payload);
        tokenStore.setTokens(accessToken, refreshToken);
        setStatus("authenticated");
    };

    const logout = async () => {
        const refreshToken = tokenStore.getRefreshToken();

        if (refreshToken) {
            try {
                await AuthService.logout(refreshToken);
            } catch (error) {
                // Даже если бэкенд недоступен - разлогиниваем локально,
                // токен всё равно больше не будет присылаться с запросами.
                console.warn("Backend logout failed, clearing local session anyway:", error);
            }
        }

        tokenStore.clear();
        setStatus("unauthenticated");
    };

    const value = useMemo(
        () => ({
            status,
            isAuthenticated: status === "authenticated",
            login,
            register,
            logout,
        }),
        [status]
    );

    return (
        <AuthProviderContext.Provider value={value}>
            {children}
        </AuthProviderContext.Provider>
    );
}

export default AuthProvider;
