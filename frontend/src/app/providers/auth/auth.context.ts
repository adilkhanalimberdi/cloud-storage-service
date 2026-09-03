import {createContext} from "react";
import type {LoginRequest} from "../../../types/request/login.ts";
import type {RegisterRequest} from "../../../types/request/register.ts";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthProviderState = {
    status: AuthStatus;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (payload: LoginRequest) => Promise<void>;
    register: (payload: RegisterRequest) => Promise<void>;
    logout: () => void;
};

export const AuthProviderContext = createContext<AuthProviderState | undefined>(undefined);
