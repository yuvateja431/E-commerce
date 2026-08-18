import { Router } from "express";
import { ContentController } from "../controllers/content.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { upsertContentPageSchema } from "../validators/content.validator";

const router = Router();

// Public route
router.get("/:pageKey", ContentController.getPage);

// Admin routes
router.put(
  "/:pageKey",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  validate(upsertContentPageSchema),
  ContentController.upsertPage
);

export default router;
