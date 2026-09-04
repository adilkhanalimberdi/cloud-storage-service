import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuth} from "../../../hooks/use.auth.ts";

function ProtectedRoute() {
    const {isAuthenticated} = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{from: location}} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
