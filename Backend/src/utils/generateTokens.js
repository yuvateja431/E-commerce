import jwt from "jsonwebtoken";
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "access_secret", {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || "15m"),
    });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || "7d"),
    });
};
