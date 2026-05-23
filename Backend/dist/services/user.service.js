"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserService {
    static async getAllUsers(query) {
        const { role, search, page = 1, limit = 10 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (role)
            where.role = role;
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const users = await prisma.user.findMany({
            where,
            skip,
            take: Number(limit),
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isEmailVerified: true,
                createdAt: true
            },
            orderBy: { createdAt: "desc" }
        });
        const total = await prisma.user.count({ where });
        return { users, total, page: Number(page), limit: Number(limit) };
    }
    static async updateUserRole(userId, role) {
        return await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: { id: true, email: true, role: true }
        });
    }
    static async deleteUser(userId) {
        return await prisma.user.delete({ where: { id: userId } });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map