"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("../services/cart.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class CartController {
    static async get(req, res, next) {
        try {
            const cart = await cart_service_1.CartService.getCart(req.user.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, cart, "Cart fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async add(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const item = await cart_service_1.CartService.addItem(req.user.id, productId, quantity);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, item, "Item added to cart"));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const item = await cart_service_1.CartService.updateItem(req.user.id, productId, quantity);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, item, "Cart updated"));
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            const updatedCart = await cart_service_1.CartService.removeItem(req.user.id, req.params.productId);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedCart, "Item removed from cart"));
        }
        catch (error) {
            next(error);
        }
    }
    static async clear(req, res, next) {
        try {
            const updatedCart = await cart_service_1.CartService.clearCart(req.user.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, updatedCart, "Cart cleared"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map