"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const coupon_service_1 = require("../services/coupon.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class CouponController {
    static async createCoupon(req, res, next) {
        try {
            // @ts-ignore - assuming req.user exists from auth middleware
            const createdBy = req.user?.id;
            const coupon = await coupon_service_1.CouponService.createCoupon(req.body, createdBy);
            return res.status(201).json(new ApiResponse_1.ApiResponse(201, coupon, "Coupon created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllCoupons(req, res, next) {
        try {
            const result = await coupon_service_1.CouponService.getAllCoupons(req.query);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, result, "Coupons retrieved successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getCouponById(req, res, next) {
        try {
            const coupon = await coupon_service_1.CouponService.getCouponById(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, coupon, "Coupon retrieved successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCoupon(req, res, next) {
        try {
            const coupon = await coupon_service_1.CouponService.updateCoupon(req.params.id, req.body);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, coupon, "Coupon updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteCoupon(req, res, next) {
        try {
            await coupon_service_1.CouponService.deleteCoupon(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, null, "Coupon deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async toggleStatus(req, res, next) {
        try {
            const coupon = await coupon_service_1.CouponService.toggleStatus(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, coupon, `Coupon marked as ${coupon.status}`));
        }
        catch (error) {
            next(error);
        }
    }
    static async validateCoupon(req, res, next) {
        try {
            const { code, cartTotal } = req.body;
            if (!code || cartTotal === undefined) {
                return res.status(400).json(new ApiResponse_1.ApiResponse(400, null, "Coupon code and cart total are required"));
            }
            // @ts-ignore
            const userId = req.user?.id;
            const result = await coupon_service_1.CouponService.validateCoupon(code, Number(cartTotal), userId);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, result, "Coupon is valid"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CouponController = CouponController;
//# sourceMappingURL=coupon.controller.js.map