import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { Role } from "@prisma/client";
const router = Router();
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
// Admin routes
router.post("/", authenticate, authorize(Role.ADMIN, Role.MANAGER), CategoryController.create);
router.put("/:id", authenticate, authorize(Role.ADMIN, Role.MANAGER), CategoryController.update);
router.delete("/:id", authenticate, authorize(Role.ADMIN), CategoryController.delete);
export default router;
