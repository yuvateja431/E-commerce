import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/suggestions", ProductController.getSuggestions);
router.get("/slug/:slug", ProductController.getBySlug);
router.get("/:id", ProductController.getById);

import { validate } from "../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "../validators/ecommerce.validator";

// Admin routes
router.post("/", authenticate, authorize(Role.ADMIN, Role.MANAGER), validate(createProductSchema), ProductController.create);
router.put("/:id", authenticate, authorize(Role.ADMIN, Role.MANAGER), validate(updateProductSchema), ProductController.update);
router.delete("/:id", authenticate, authorize(Role.ADMIN), ProductController.delete);
router.patch("/:id/stock", authenticate, authorize(Role.ADMIN, Role.MANAGER), ProductController.updateStock);

// Variant routes (Admin)
router.post("/:id/variants", authenticate, authorize(Role.ADMIN, Role.MANAGER), ProductController.addVariant);
router.put("/:id/variants/:variantId", authenticate, authorize(Role.ADMIN, Role.MANAGER), ProductController.updateVariant);
router.delete("/:id/variants/:variantId", authenticate, authorize(Role.ADMIN), ProductController.deleteVariant);

export default router;
