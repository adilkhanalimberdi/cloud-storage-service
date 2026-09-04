import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../../hooks/use.auth.ts";

function PublicRoute() {
    const {isAuthenticated} = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;
