let accessToken: string | null = null;

export const tokenStore = {
    getAccessToken(): string | null {
        return accessToken;
    },
    setAccessToken(token: string | null) {
        accessToken = token;
    },
    clear() {
        accessToken = null;
    },
};
