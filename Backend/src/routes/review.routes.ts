import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/product/:productId", ReviewController.getByProduct);

router.post("/product/:productId", authenticate, ReviewController.add);
router.delete("/:id", authenticate, ReviewController.delete);

export default router;
