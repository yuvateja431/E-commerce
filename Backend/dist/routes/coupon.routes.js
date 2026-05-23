"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coupon_controller_1 = require("../controllers/coupon.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const router = (0, express_1.Router)();
// Customer/Checkout routes
router.post("/validate", coupon_controller_1.CouponController.validateCoupon);
// TODO: apply route could be part of order placement
// Admin routes
router.use(auth_middleware_1.authenticate);
router.use((0, role_middleware_1.authorize)("ADMIN", "MANAGER"));
router.get("/", coupon_controller_1.CouponController.getAllCoupons);
router.get("/:id", coupon_controller_1.CouponController.getCouponById);
router.post("/", coupon_controller_1.CouponController.createCoupon);
router.put("/:id", coupon_controller_1.CouponController.updateCoupon);
router.delete("/:id", coupon_controller_1.CouponController.deleteCoupon);
router.patch("/:id/toggle-status", coupon_controller_1.CouponController.toggleStatus);
exports.default = router;
//# sourceMappingURL=coupon.routes.js.map