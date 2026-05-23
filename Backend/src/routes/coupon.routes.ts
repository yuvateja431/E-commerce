import { Router } from "express";
import { CouponController } from "../controllers/coupon.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Customer/Checkout routes
router.post("/validate", CouponController.validateCoupon);
// TODO: apply route could be part of order placement

// Admin routes
router.use(authenticate);
router.use(authorize("ADMIN", "MANAGER"));

router.get("/", CouponController.getAllCoupons);
router.get("/:id", CouponController.getCouponById);
router.post("/", CouponController.createCoupon);
router.put("/:id", CouponController.updateCoupon);
router.delete("/:id", CouponController.deleteCoupon);
router.patch("/:id/toggle-status", CouponController.toggleStatus);

export default router;
