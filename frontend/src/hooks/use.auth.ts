import {useContext} from "react";
import {AuthProviderContext} from "../app/providers/auth/auth.context.ts";

export const useAuth = () => {
    const context = useContext(AuthProviderContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
