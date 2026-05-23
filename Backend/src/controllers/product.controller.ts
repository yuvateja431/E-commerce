import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { ApiResponse } from "../utils/ApiResponse";

export class ProductController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.createProduct(req.body);
      return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getAllProducts(req.query);
      return res.status(200).json(new ApiResponse(200, result, "Products fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const search = (req.query.q as string) || "";
      const suggestions = await ProductService.getSuggestions(search);
      return res.status(200).json(new ApiResponse(200, suggestions, "Suggestions fetched"));
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id as string);
      return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug as string);
      return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.updateProduct(req.params.id as string, req.body);
      return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id as string);
      return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await ProductService.updateStock(req.params.id as string, req.body.quantity);
      return res.status(200).json(new ApiResponse(200, inventory, "Stock updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async addVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const variant = await ProductService.addVariant(req.params.id as string, req.body);
      return res.status(201).json(new ApiResponse(201, variant, "Variant added successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateVariant(req: Request, res: Response, next: NextFunction) {
    try {
      const variant = await ProductService.updateVariant(req.params.id as string, req.params.variantId as string, req.body);
      return res.status(200).json(new ApiResponse(200, variant, "Variant updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async deleteVariant(req: Request, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteVariant(req.params.id as string, req.params.variantId as string);
      return res.status(200).json(new ApiResponse(200, {}, "Variant deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
