import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router.post("/checkout", OrderController.create);
router.get("/my-orders", OrderController.getUserOrders);
router.get("/:id", OrderController.getById);

// Admin routes
router.get("/", authorize(Role.ADMIN, Role.MANAGER), OrderController.getAll);
router.get("/count", authorize(Role.ADMIN, Role.MANAGER), OrderController.getCount);
router.patch("/:id/status", authorize(Role.ADMIN, Role.MANAGER), OrderController.updateStatus);

export default router;
