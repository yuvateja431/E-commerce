"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/product/:productId", review_controller_1.ReviewController.getByProduct);
router.post("/product/:productId", auth_middleware_1.authenticate, review_controller_1.ReviewController.add);
router.delete("/:id", auth_middleware_1.authenticate, review_controller_1.ReviewController.delete);
exports.default = router;
//# sourceMappingURL=review.routes.js.map