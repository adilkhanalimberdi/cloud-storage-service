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
    const [status, setStatus] = useState<AuthStatus>("loading");

    useEffect(() => {
        AuthService.refresh()
            .then(({accessToken}) => {
                tokenStore.setAccessToken(accessToken);
                setStatus("authenticated");
            })
            .catch((error) => {
                // Ожидаемо при первом заходе (нет refresh-cookie) - не считаем это критичным.
                // Но если проблема в другом (сеть/CORS/бэкенд не поднят) - лучше увидеть это в консоли.
                console.warn("Silent refresh failed:", error);
                tokenStore.clear();
                setStatus("unauthenticated");
            });
    }, []);

    useEffect(() => {
        return authEvents.onUnauthorized(() => {
            setStatus("unauthenticated");
        });
    }, []);

    const login = async (payload: LoginRequest) => {
        const {accessToken} = await AuthService.login(payload);
        tokenStore.setAccessToken(accessToken);
        setStatus("authenticated");
    };

    const register = async (payload: RegisterRequest) => {
        const {accessToken} = await AuthService.register(payload);
        tokenStore.setAccessToken(accessToken);
        setStatus("authenticated");
    };

    const logout = () => {
        tokenStore.clear();
        setStatus("unauthenticated");
    };

    const value = useMemo(
        () => ({
            status,
            isLoading: status === "loading",
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
