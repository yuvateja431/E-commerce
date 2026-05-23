import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate, authorize(Role.ADMIN));

router.get("/", UserController.getAll);
router.patch("/:id/role", UserController.updateRole);
router.delete("/:id", UserController.delete);

export default router;
