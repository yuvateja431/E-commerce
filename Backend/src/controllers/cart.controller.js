import { CartService } from "../services/cart.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class CartController {
    static async get(req, res, next) {
        try {
            const cart = await CartService.getCart(req.user.id);
            return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async add(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const item = await CartService.addItem(req.user.id, productId, quantity);
            return res.status(200).json(new ApiResponse(200, item, "Item added to cart"));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const item = await CartService.updateItem(req.user.id, productId, quantity);
            return res.status(200).json(new ApiResponse(200, item, "Cart updated"));
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            const updatedCart = await CartService.removeItem(req.user.id, req.params.productId);
            return res.status(200).json(new ApiResponse(200, updatedCart, "Item removed from cart"));
        }
        catch (error) {
            next(error);
        }
    }
    static async clear(req, res, next) {
        try {
            const updatedCart = await CartService.clearCart(req.user.id);
            return res.status(200).json(new ApiResponse(200, updatedCart, "Cart cleared"));
        }
        catch (error) {
            next(error);
        }
    }
}
