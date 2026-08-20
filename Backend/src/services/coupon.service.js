import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
const prisma = new PrismaClient();
export class CouponService {
    static async createCoupon(data, createdBy) {
        // Check if code already exists
        const existing = await prisma.coupon.findUnique({
            where: { code: data.code.toUpperCase() }
        });
        if (existing) {
            throw new ApiError(400, "Coupon code already exists");
        }
        if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
            throw new ApiError(400, "Percentage discount cannot exceed 100%");
        }
        if (new Date(data.expiryDate) <= new Date(data.validFrom || new Date())) {
            throw new ApiError(400, "Expiry date must be after valid from date");
        }
        return await prisma.coupon.create({
            data: {
                ...data,
                code: data.code.toUpperCase(),
                createdBy
            }
        });
    }
    static async getAllCoupons(query) {
        const { page = 1, limit = 10, search, status, type, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status) {
            where.status = status;
        }
        if (type) {
            where.discountType = type;
        }
        const [coupons, total] = await Promise.all([
            prisma.coupon.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: {
                    [sortBy]: sortOrder
                }
            }),
            prisma.coupon.count({ where })
        ]);
        return {
            coupons,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    static async getCouponById(id) {
        const coupon = await prisma.coupon.findUnique({
            where: { id },
            include: {
                orders: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                    select: { id: true, totalAmount: true, userId: true, createdAt: true, user: { select: { firstName: true, lastName: true } } }
                }
            }
        });
        if (!coupon) {
            throw new ApiError(404, "Coupon not found");
        }
        return coupon;
    }
    static async updateCoupon(id, data) {
        const coupon = await prisma.coupon.findUnique({ where: { id } });
        if (!coupon) {
            throw new ApiError(404, "Coupon not found");
        }
        if (data.code && data.code.toUpperCase() !== coupon.code) {
            const existing = await prisma.coupon.findUnique({
                where: { code: data.code.toUpperCase() }
            });
            if (existing) {
                throw new ApiError(400, "Coupon code already exists");
            }
        }
        if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
            throw new ApiError(400, "Percentage discount cannot exceed 100%");
        }
        return await prisma.coupon.update({
            where: { id },
            data: {
                ...data,
                code: data.code ? data.code.toUpperCase() : undefined
            }
        });
    }
    static async deleteCoupon(id) {
        // Check if it's used in orders. If yes, maybe just soft delete (mark INACTIVE) instead of hard delete.
        const coupon = await prisma.coupon.findUnique({
            where: { id },
            include: { _count: { select: { orders: true } } }
        });
        if (!coupon)
            throw new ApiError(404, "Coupon not found");
        if (coupon._count.orders > 0) {
            // Soft delete
            return await prisma.coupon.update({
                where: { id },
                data: { status: 'EXPIRED' }
            });
        }
        return await prisma.coupon.delete({ where: { id } });
    }
    static async toggleStatus(id) {
        const coupon = await prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new ApiError(404, "Coupon not found");
        const newStatus = coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return await prisma.coupon.update({
            where: { id },
            data: { status: newStatus }
        });
    }
    // --- Customer Checkout Validation ---
    static async validateCoupon(code, cartTotal, userId) {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });
        if (!coupon) {
            throw new ApiError(404, "Invalid coupon code");
        }
        if (coupon.status !== 'ACTIVE') {
            throw new ApiError(400, `Coupon is ${coupon.status.toLowerCase()}`);
        }
        const now = new Date();
        if (now < new Date(coupon.validFrom)) {
            throw new ApiError(400, "Coupon is not yet valid");
        }
        if (now > new Date(coupon.expiryDate)) {
            throw new ApiError(400, "Coupon has expired");
        }
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new ApiError(400, "Coupon usage limit reached");
        }
        if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
            throw new ApiError(400, `Minimum order amount of ₹${coupon.minOrderAmount} required`);
        }
        if (userId && coupon.applicableUsers.length > 0 && !coupon.applicableUsers.includes(userId)) {
            throw new ApiError(400, "You are not eligible to use this coupon");
        }
        if (userId && coupon.perUserLimit) {
            // Check how many times this user has used this coupon
            const usageCount = await prisma.order.count({
                where: {
                    couponId: coupon.id,
                    userId: userId
                }
            });
            if (usageCount >= coupon.perUserLimit) {
                throw new ApiError(400, `You have reached the maximum usage limit for this coupon`);
            }
        }
        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        }
        else {
            discountAmount = coupon.discountValue;
        }
        // Don't discount more than cart total
        discountAmount = Math.min(discountAmount, cartTotal);
        return {
            coupon,
            discountAmount,
            finalTotal: cartTotal - discountAmount
        };
    }
}
