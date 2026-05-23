import { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service";
import { ApiResponse } from "../utils/ApiResponse";

export class CartController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(req.user.id);
      return res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;
      const item = await CartService.addItem(req.user.id, productId, quantity);
      return res.status(200).json(new ApiResponse(200, item, "Item added to cart"));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;
      const item = await CartService.updateItem(req.user.id, productId, quantity);
      return res.status(200).json(new ApiResponse(200, item, "Cart updated"));
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedCart = await CartService.removeItem(req.user.id, req.params.productId as string);
      return res.status(200).json(new ApiResponse(200, updatedCart, "Item removed from cart"));
    } catch (error) {
      next(error);
    }
  }

  static async clear(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedCart = await CartService.clearCart(req.user.id);
      return res.status(200).json(new ApiResponse(200, updatedCart, "Cart cleared"));
    } catch (error) {
      next(error);
    }
  }
}
