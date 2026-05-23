"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("../services/review.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class ReviewController {
    static async add(req, res, next) {
        try {
            const review = await review_service_1.ReviewService.addReview(req.user.id, req.params.productId, req.body);
            return res.status(201).json(new ApiResponse_1.ApiResponse(201, review, "Review added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getByProduct(req, res, next) {
        try {
            const reviews = await review_service_1.ReviewService.getProductReviews(req.params.productId);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, reviews, "Reviews fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await review_service_1.ReviewService.deleteReview(req.user.id, req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "Review deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map