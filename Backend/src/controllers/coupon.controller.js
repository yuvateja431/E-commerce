import { CouponService } from "../services/coupon.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class CouponController {
    static async createCoupon(req, res, next) {
        try {
            // @ts-ignore - assuming req.user exists from auth middleware
            const createdBy = req.user?.id;
            const coupon = await CouponService.createCoupon(req.body, createdBy);
            return res.status(201).json(new ApiResponse(201, coupon, "Coupon created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllCoupons(req, res, next) {
        try {
            const result = await CouponService.getAllCoupons(req.query);
            return res.status(200).json(new ApiResponse(200, result, "Coupons retrieved successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getCouponById(req, res, next) {
        try {
            const coupon = await CouponService.getCouponById(req.params.id);
            return res.status(200).json(new ApiResponse(200, coupon, "Coupon retrieved successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCoupon(req, res, next) {
        try {
            const coupon = await CouponService.updateCoupon(req.params.id, req.body);
            return res.status(200).json(new ApiResponse(200, coupon, "Coupon updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCoupon(req, res, next) {
        try {
            await CouponService.deleteCoupon(req.params.id);
            return res.status(200).json(new ApiResponse(200, null, "Coupon deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async toggleStatus(req, res, next) {
        try {
            const coupon = await CouponService.toggleStatus(req.params.id);
            return res.status(200).json(new ApiResponse(200, coupon, `Coupon marked as ${coupon.status}`));
        }
        catch (error) {
            next(error);
        }
    }
    static async validateCoupon(req, res, next) {
        try {
            const { code, cartTotal } = req.body;
            if (!code || cartTotal === undefined) {
                return res.status(400).json(new ApiResponse(400, null, "Coupon code and cart total are required"));
            }
            // @ts-ignore
            const userId = req.user?.id;
            const result = await CouponService.validateCoupon(code, Number(cartTotal), userId);
            return res.status(200).json(new ApiResponse(200, result, "Coupon is valid"));
        }
        catch (error) {
            next(error);
        }
    }
}
