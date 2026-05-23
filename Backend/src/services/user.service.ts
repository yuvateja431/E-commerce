import { PrismaClient, Role } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

export class UserService {
  static async getAllUsers(query: any) {
    const { role, search, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (role) where.role = role as Role;
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

  static async updateUserRole(userId: string, role: Role) {
    return await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true }
    });
  }

  static async deleteUser(userId: string) {
    return await prisma.user.delete({ where: { id: userId } });
  }
}
