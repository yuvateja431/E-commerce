import { Request, Response, NextFunction } from "express";
import { WishlistService } from "../services/wishlist.service";
import { ApiResponse } from "../utils/ApiResponse";

export class WishlistController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const wishlist = await WishlistService.getWishlist(req.user.id);
      return res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body;
      const item = await WishlistService.addItem(req.user.id, productId);
      return res.status(200).json(new ApiResponse(200, item, "Item added to wishlist"));
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await WishlistService.removeItem(req.user.id, req.params.productId as string);
      return res.status(200).json(new ApiResponse(200, {}, "Item removed from wishlist"));
    } catch (error) {
      next(error);
    }
  }
}
