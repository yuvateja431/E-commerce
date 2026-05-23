import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { ApiResponse } from "../utils/ApiResponse";

export class ReviewController {
  static async add(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.addReview(req.user.id, req.params.productId as string, req.body);
      return res.status(201).json(new ApiResponse(201, review, "Review added successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.getProductReviews(req.params.productId as string);
      return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ReviewService.deleteReview(req.user.id, req.params.id as string);
      return res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
