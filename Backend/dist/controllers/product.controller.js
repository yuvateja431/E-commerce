"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class ProductController {
    static async create(req, res, next) {
        try {
            const product = await product_service_1.ProductService.createProduct(req.body);
            return res.status(201).json(new ApiResponse_1.ApiResponse(201, product, "Product created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const result = await product_service_1.ProductService.getAllProducts(req.query);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, result, "Products fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getSuggestions(req, res, next) {
        try {
            const search = req.query.q || "";
            const suggestions = await product_service_1.ProductService.getSuggestions(search);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, suggestions, "Suggestions fetched"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const product = await product_service_1.ProductService.getProductById(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, product, "Product fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getBySlug(req, res, next) {
        try {
            const product = await product_service_1.ProductService.getProductBySlug(req.params.slug);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, product, "Product fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const product = await product_service_1.ProductService.updateProduct(req.params.id, req.body);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, product, "Product updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await product_service_1.ProductService.deleteProduct(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Product deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateStock(req, res, next) {
        try {
            const inventory = await product_service_1.ProductService.updateStock(req.params.id, req.body.quantity);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, inventory, "Stock updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async addVariant(req, res, next) {
        try {
            const variant = await product_service_1.ProductService.addVariant(req.params.id, req.body);
            return res.status(201).json(new ApiResponse_1.ApiResponse(201, variant, "Variant added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateVariant(req, res, next) {
        try {
            const variant = await product_service_1.ProductService.updateVariant(req.params.id, req.params.variantId, req.body);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, variant, "Variant updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteVariant(req, res, next) {
        try {
            await product_service_1.ProductService.deleteVariant(req.params.id, req.params.variantId);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Variant deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map