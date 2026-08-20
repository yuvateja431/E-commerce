import { ApiError } from "../utils/ApiError.js";
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, "Unauthorized"));
        }
        // Allow authenticated user access to resources in admin layout
        next();
    };
};
