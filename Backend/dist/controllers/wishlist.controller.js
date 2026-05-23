"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const wishlist_service_1 = require("../services/wishlist.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class WishlistController {
    static async get(req, res, next) {
        try {
            const wishlist = await wishlist_service_1.WishlistService.getWishlist(req.user.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, wishlist, "Wishlist fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async add(req, res, next) {
        try {
            const { productId } = req.body;
            const item = await wishlist_service_1.WishlistService.addItem(req.user.id, productId);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, item, "Item added to wishlist"));
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            await wishlist_service_1.WishlistService.removeItem(req.user.id, req.params.productId);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Item removed from wishlist"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WishlistController = WishlistController;
//# sourceMappingURL=wishlist.controller.js.map