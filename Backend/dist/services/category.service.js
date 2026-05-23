"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../utils/ApiError");
const prisma = new client_1.PrismaClient();
class CategoryService {
    static async createCategory(data) {
        const existing = await prisma.category.findUnique({ where: { name: data.name } });
        if (existing)
            throw new ApiError_1.ApiError(400, "Category already exists");
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
            throw new ApiError_1.ApiError(404, "Category not found");
        return category;
    }
    static async updateCategory(id, data) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new ApiError_1.ApiError(404, "Category not found");
        return await prisma.category.update({ where: { id }, data });
    }
    static async deleteCategory(id) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new ApiError_1.ApiError(404, "Category not found");
        return await prisma.category.delete({ where: { id } });
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map