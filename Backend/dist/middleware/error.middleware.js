"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const errorHandler = (err, req, res, next) => {
    // Suppress expected JWT and token errors to keep console clean
    const suppressedMessages = [
        "jwt expired",
        "Invalid access token",
        "Refresh token is required",
        "Invalid or expired refresh token"
    ];
    if (!suppressedMessages.includes(err?.message)) {
        console.error("Error caught in middleware:", err);
    }
    let error = err;
    if (!(error instanceof ApiError_1.ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError_1.ApiError(statusCode, message, err?.errors || [], err.stack);
    }
    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
    };
    return res.status(error.statusCode).json(response);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map