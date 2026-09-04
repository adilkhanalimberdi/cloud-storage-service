export type LoginRequest = {
    username: string;
    password: string;
};

export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
};

export type LogoutRequest = {
    refreshToken: string;
};

export type RefreshRequest = {
    refreshToken: string;
};

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
};
