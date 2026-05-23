"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN));
router.get("/", user_controller_1.UserController.getAll);
router.patch("/:id/role", user_controller_1.UserController.updateRole);
router.delete("/:id", user_controller_1.UserController.delete);
exports.default = router;
//# sourceMappingURL=user.routes.js.map