import { Router } from "express";
import { ContentController } from "../controllers/content.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { upsertContentPageSchema } from "../validators/content.validator.js";
const router = Router();
// Public route
router.get("/:pageKey", ContentController.getPage);
// Admin routes
router.put("/:pageKey", authenticate, authorize("ADMIN", "MANAGER"), validate(upsertContentPageSchema), ContentController.upsertPage);
export default router;
