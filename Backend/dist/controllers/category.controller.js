"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class CategoryController {
    static async create(req, res, next) {
        try {
            const category = await category_service_1.CategoryService.createCategory(req.body);
            return res.status(201).json(new ApiResponse_1.ApiResponse(201, category, "Category created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const categories = await category_service_1.CategoryService.getAllCategories();
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, categories, "Categories fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const category = await category_service_1.CategoryService.getCategoryById(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, category, "Category fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const category = await category_service_1.CategoryService.updateCategory(req.params.id, req.body);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, category, "Category updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await category_service_1.CategoryService.deleteCategory(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Category deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map