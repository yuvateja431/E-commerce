"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../utils/ApiError");
const prisma = new client_1.PrismaClient();
class ReviewService {
    static async addReview(userId, productId, data) {
        // Check if user has already reviewed
        const existing = await prisma.review.findUnique({
            where: { userId_productId: { userId, productId } }
        });
        if (existing) {
            return await prisma.review.update({
                where: { id: existing.id },
                data
            });
        }
        return await prisma.review.create({
            data: { userId, productId, ...data }
        });
    }
    static async getProductReviews(productId) {
        return await prisma.review.findMany({
            where: { productId },
            include: { user: { select: { firstName: true, lastName: true } } },
            orderBy: { createdAt: "desc" }
        });
    }
    static async deleteReview(userId, reviewId) {
        const review = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new ApiError_1.ApiError(404, "Review not found");
        if (review.userId !== userId)
            throw new ApiError_1.ApiError(403, "Not authorized to delete this review");
        return await prisma.review.delete({ where: { id: reviewId } });
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map