import { CategoryService } from "../services/category.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class CategoryController {
    static async create(req, res, next) {
        try {
            const category = await CategoryService.createCategory(req.body);
            return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await CategoryService.deleteCategory(req.params.id);
            return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
