"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER));
router.get("/dashboard", analytics_controller_1.AnalyticsController.getStats);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map