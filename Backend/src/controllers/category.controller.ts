import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { ApiResponse } from "../utils/ApiResponse";

export class CategoryController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAllCategories();
      return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id as string);
      return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.updateCategory(req.params.id as string, req.body);
      return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CategoryService.deleteCategory(req.params.id as string);
      return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
