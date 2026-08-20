import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
const prisma = new PrismaClient();
export class CategoryService {
    static async createCategory(data) {
        const existing = await prisma.category.findUnique({ where: { name: data.name } });
        if (existing)
            throw new ApiError(400, "Category already exists");
        return await prisma.category.create({ data });
    }
    static async getAllCategories() {
        return await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
        });
    }
    static async getCategoryById(id) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new ApiError(404, "Category not found");
        return category;
    }
    static async updateCategory(id, data) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new ApiError(404, "Category not found");
        return await prisma.category.update({ where: { id }, data });
    }
    static async deleteCategory(id) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new ApiError(404, "Category not found");
        return await prisma.category.delete({ where: { id } });
    }
}
