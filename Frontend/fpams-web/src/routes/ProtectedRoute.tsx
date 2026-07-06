import { Navigate, Outlet, useLocation } from "react-router-dom";

import { canAccessPath } from "../config/roleAccess";
import authService from "../services/authService";

export default function ProtectedRoute() {
    const location = useLocation();
    const user = authService.getUser();

    if (!authService.isAuthenticated() || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!canAccessPath(user, location.pathname)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
