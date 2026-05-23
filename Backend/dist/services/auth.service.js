"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const ApiError_1 = require("../utils/ApiError");
const generateTokens_1 = require("../utils/generateTokens");
const sendEmail_1 = require("../utils/sendEmail");
const prisma = new client_1.PrismaClient();
class AuthService {
    static async register(data) {
        const { firstName, lastName, email, password } = data;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ApiError_1.ApiError(400, "User with this email already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: client_1.Role.USER,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        const accessToken = (0, generateTokens_1.generateAccessToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, generateTokens_1.generateRefreshToken)({ id: user.id });
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        return { user, accessToken, refreshToken };
    }
    static async login(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid email or password");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError_1.ApiError(401, "Invalid email or password");
        }
        const accessToken = (0, generateTokens_1.generateAccessToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = (0, generateTokens_1.generateRefreshToken)({ id: user.id });
        // Remove old tokens and add new one
        await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        const { password: _, ...userProfile } = user;
        return { user: userProfile, accessToken, refreshToken };
    }
    static async refreshToken(oldRefreshToken) {
        if (!oldRefreshToken) {
            throw new ApiError_1.ApiError(401, "Refresh token is required");
        }
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: oldRefreshToken },
            include: { user: true }
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            if (storedToken)
                await prisma.refreshToken.delete({ where: { id: storedToken.id } });
            throw new ApiError_1.ApiError(403, "Invalid or expired refresh token");
        }
        const user = storedToken.user;
        const accessToken = (0, generateTokens_1.generateAccessToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const newRefreshToken = (0, generateTokens_1.generateRefreshToken)({ id: user.id });
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
        return { accessToken, refreshToken: newRefreshToken };
    }
    static async logout(userId) {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    static async forgotPassword(email) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return;
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
            },
        });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;
        try {
            await (0, sendEmail_1.sendEmail)({
                email: user.email,
                subject: "Password Reset Token",
                message,
            });
        }
        catch (error) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                },
            });
            throw new ApiError_1.ApiError(500, "Email could not be sent");
        }
    }
    static async resetPassword(token, password) {
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() },
            },
        });
        if (!user) {
            throw new ApiError_1.ApiError(400, "Invalid or expired reset token");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }
    static async getCurrentUser(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isEmailVerified: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        return user;
    }
    static async updateProfile(userId, data) {
        const { firstName, lastName } = data;
        const updateData = {};
        if (firstName !== undefined)
            updateData.firstName = firstName;
        if (lastName !== undefined)
            updateData.lastName = lastName;
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isEmailVerified: true,
                createdAt: true,
            },
        });
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map