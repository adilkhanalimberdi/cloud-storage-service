import {Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage.tsx";
import ProtectedRoute from "./guards/ProtectedRoute.tsx";
import PublicRoute from "./guards/PublicRoute.tsx";
import LoginPage from "../../pages/auth/LoginPage.tsx";
import RegisterPage from "../../pages/auth/RegisterPage.tsx";

function AppRouter() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
            </Route>
        </Routes>
    );
}

export default AppRouter;