import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", WishlistController.get);
router.post("/add", WishlistController.add);
router.delete("/remove/:productId", WishlistController.remove);

export default router;
