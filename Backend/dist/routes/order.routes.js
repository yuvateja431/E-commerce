"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post("/checkout", order_controller_1.OrderController.create);
router.get("/my-orders", order_controller_1.OrderController.getUserOrders);
router.get("/:id", order_controller_1.OrderController.getById);
// Admin routes
router.get("/", (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), order_controller_1.OrderController.getAll);
router.get("/count", (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), order_controller_1.OrderController.getCount);
router.patch("/:id/status", (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), order_controller_1.OrderController.updateStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map