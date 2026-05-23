"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get("/", cart_controller_1.CartController.get);
router.post("/add", cart_controller_1.CartController.add);
router.put("/update", cart_controller_1.CartController.update);
router.delete("/remove/:productId", cart_controller_1.CartController.remove);
router.delete("/clear", cart_controller_1.CartController.clear);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map