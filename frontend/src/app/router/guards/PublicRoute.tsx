import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../../hooks/use.auth.ts";
import RouteFallback from "./RouteFallback.tsx";

function PublicRoute() {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return <RouteFallback />;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;
