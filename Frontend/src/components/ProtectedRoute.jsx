import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace/>;
    }
    return children;
};
