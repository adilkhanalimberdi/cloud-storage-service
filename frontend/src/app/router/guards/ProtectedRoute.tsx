import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../../../hooks/use.auth.ts";
import RouteFallback from "./RouteFallback.tsx";

function ProtectedRoute() {
    const {isAuthenticated, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <RouteFallback />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{from: location}} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
