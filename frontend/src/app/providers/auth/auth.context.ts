import {createContext} from "react";
import type {LoginRequest, RegisterRequest} from "../../../types/auth.ts";

export type AuthStatus = "authenticated" | "unauthenticated";

export type AuthProviderState = {
    status: AuthStatus;
    isAuthenticated: boolean;
    login: (payload: LoginRequest) => Promise<void>;
    register: (payload: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthProviderContext = createContext<AuthProviderState | undefined>(undefined);
