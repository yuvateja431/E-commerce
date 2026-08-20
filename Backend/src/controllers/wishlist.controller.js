import { WishlistService } from "../services/wishlist.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class WishlistController {
    static async get(req, res, next) {
        try {
            const wishlist = await WishlistService.getWishlist(req.user.id);
            return res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async add(req, res, next) {
        try {
            const { productId } = req.body;
            const item = await WishlistService.addItem(req.user.id, productId);
            return res.status(200).json(new ApiResponse(200, item, "Item added to wishlist"));
        }
        catch (error) {
            next(error);
        }
    }
    static async remove(req, res, next) {
        try {
            await WishlistService.removeItem(req.user.id, req.params.productId);
            return res.status(200).json(new ApiResponse(200, {}, "Item removed from wishlist"));
        }
        catch (error) {
            next(error);
        }
    }
}
