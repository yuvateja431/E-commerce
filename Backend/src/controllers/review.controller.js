import { ReviewService } from "../services/review.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class ReviewController {
    static async add(req, res, next) {
        try {
            const review = await ReviewService.addReview(req.user.id, req.params.productId, req.body);
            return res.status(201).json(new ApiResponse(201, review, "Review added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getByProduct(req, res, next) {
        try {
            const reviews = await ReviewService.getProductReviews(req.params.productId);
            return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await ReviewService.deleteReview(req.user.id, req.params.id);
            return res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
