import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate, authorize(Role.ADMIN, Role.MANAGER));

router.get("/dashboard", AnalyticsController.getStats);

export default router;
