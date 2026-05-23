"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const ApiError_1 = require("../utils/ApiError");
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError_1.ApiError(401, "Unauthorized"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(403, `Role: ${req.user.role} is not allowed to access this resource`));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=role.middleware.js.map