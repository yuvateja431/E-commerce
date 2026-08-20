import { ProductService } from "../services/product.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class ProductController {
    static async create(req, res, next) {
        try {
            const product = await ProductService.createProduct(req.body);
            return res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const result = await ProductService.getAllProducts(req.query);
            return res.status(200).json(new ApiResponse(200, result, "Products fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getSuggestions(req, res, next) {
        try {
            const search = req.query.q || "";
            const suggestions = await ProductService.getSuggestions(search);
            return res.status(200).json(new ApiResponse(200, suggestions, "Suggestions fetched"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getBySlug(req, res, next) {
        try {
            const product = await ProductService.getProductBySlug(req.params.slug);
            return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await ProductService.deleteProduct(req.params.id);
            return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStock(req, res, next) {
        try {
            const inventory = await ProductService.updateStock(req.params.id, req.body.quantity);
            return res.status(200).json(new ApiResponse(200, inventory, "Stock updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async addVariant(req, res, next) {
        try {
            const variant = await ProductService.addVariant(req.params.id, req.body);
            return res.status(201).json(new ApiResponse(201, variant, "Variant added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateVariant(req, res, next) {
        try {
            const variant = await ProductService.updateVariant(req.params.id, req.params.variantId, req.body);
            return res.status(200).json(new ApiResponse(200, variant, "Variant updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteVariant(req, res, next) {
        try {
            await ProductService.deleteVariant(req.params.id, req.params.variantId);
            return res.status(200).json(new ApiResponse(200, {}, "Variant deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
