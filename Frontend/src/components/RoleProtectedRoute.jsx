import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace/>;
    }
    return children;
};
