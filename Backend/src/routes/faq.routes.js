import { Router } from "express";
import { FAQController } from "../controllers/faq.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createFAQSchema, updateFAQSchema } from "../validators/faq.validator.js";
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
