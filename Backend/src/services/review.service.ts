import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

export class ReviewService {
  static async addReview(userId: string, productId: string, data: { rating: number; comment?: string }) {
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

  static async getProductReviews(productId: string) {
    return await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  static async deleteReview(userId: string, reviewId: string) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new ApiError(404, "Review not found");
    if (review.userId !== userId) throw new ApiError(403, "Not authorized to delete this review");

    return await prisma.review.delete({ where: { id: reviewId } });
  }
}
