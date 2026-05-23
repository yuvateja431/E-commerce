"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET || "access_secret", {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || "15m"),
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || "7d"),
    });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=generateTokens.js.map