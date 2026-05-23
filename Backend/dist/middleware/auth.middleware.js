"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const client_1 = require("@prisma/client");
const auth_service_1 = require("../services/auth.service");
const prisma = new client_1.PrismaClient();
const authenticate = async (req, res, next) => {
    try {
        // Retrieve token from cookies, Authorization header, request body, or query parameters
        let token = req.cookies?.accessToken;
        if (!token) {
            const authHeader = req.header('Authorization') || req.headers['authorization'];
            if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7).trim();
            }
        }
        // Fallbacks: body or query
        if (!token) {
            token = req.body?.accessToken || req.query?.accessToken;
        }
        if (!token) {
            throw new ApiError_1.ApiError(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET || "access_secret");
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        // If token expired, attempt refresh using refresh token
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            try {
                const oldRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
                if (!oldRefreshToken) {
                    throw new ApiError_1.ApiError(401, "Refresh token is required");
                }
                const { accessToken, refreshToken } = await auth_service_1.AuthService.refreshToken(oldRefreshToken);
                // Set new access token cookie
                const accessCookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                };
                res.cookie("accessToken", accessToken, accessCookieOptions);
                // Rotate refresh token cookie (7 days)
                const refreshCookieOptions = {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                };
                res.cookie("refreshToken", refreshToken, refreshCookieOptions);
                // Decode the new access token to fetch user info
                const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "access_secret");
                const user = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                });
                if (!user) {
                    throw new ApiError_1.ApiError(401, "Invalid Access Token");
                }
                req.user = user;
                return next();
            }
            catch (refreshError) {
                return next(new ApiError_1.ApiError(401, refreshError?.message || "Unauthorized request"));
            }
        }
        // Other errors (e.g., malformed token)
        return next(new ApiError_1.ApiError(401, error?.message || "Invalid access token"));
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map