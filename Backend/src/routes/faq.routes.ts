import { Router } from "express";
import { FAQController } from "../controllers/faq.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createFAQSchema, updateFAQSchema } from "../validators/faq.validator";

const router = Router();

// Public routes
router.get("/", FAQController.getAll);
router.get("/:id", FAQController.getById);

// Admin routes
router.use(authenticate);
router.use(authorize("ADMIN", "MANAGER"));

router.post("/", validate(createFAQSchema), FAQController.create);
router.put("/:id", validate(updateFAQSchema), FAQController.update);
router.delete("/:id", FAQController.delete);

export default router;
