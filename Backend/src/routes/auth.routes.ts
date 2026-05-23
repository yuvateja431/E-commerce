import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), AuthController.resetPassword);

// Protected routes
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.me);
router.patch("/profile", authenticate, AuthController.updateProfile);

export default router;
