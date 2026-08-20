import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { Role } from "@prisma/client";
const router = Router();
router.use(authenticate, authorize(Role.ADMIN, Role.MANAGER));
router.get("/dashboard", AnalyticsController.getStats);
export default router;
