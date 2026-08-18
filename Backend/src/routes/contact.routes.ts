import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createContactMessageSchema,
  updateContactMessageStatusSchema,
  updateContactSettingsSchema,
} from "../validators/contact.validator";

const router = Router();

// Public routes
router.get("/settings", ContactController.getSettings);
router.post("/messages", validate(createContactMessageSchema), ContactController.createMessage);

// Admin routes for contact settings & messages
router.put(
  "/settings",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  validate(updateContactSettingsSchema),
  ContactController.updateSettings
);

router.get(
  "/messages",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ContactController.getAllMessages
);

router.get(
  "/messages/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ContactController.getMessageById
);

router.put(
  "/messages/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  validate(updateContactMessageStatusSchema),
  ContactController.updateMessageStatus
);

router.delete(
  "/messages/:id",
  authenticate,
  authorize("ADMIN", "MANAGER"),
  ContactController.deleteMessage
);

export default router;
