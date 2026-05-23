"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get("/", product_controller_1.ProductController.getAll);
router.get("/suggestions", product_controller_1.ProductController.getSuggestions);
router.get("/slug/:slug", product_controller_1.ProductController.getBySlug);
router.get("/:id", product_controller_1.ProductController.getById);
const validate_middleware_1 = require("../middleware/validate.middleware");
const ecommerce_validator_1 = require("../validators/ecommerce.validator");
// Admin routes
router.post("/", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), (0, validate_middleware_1.validate)(ecommerce_validator_1.createProductSchema), product_controller_1.ProductController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), (0, validate_middleware_1.validate)(ecommerce_validator_1.updateProductSchema), product_controller_1.ProductController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN), product_controller_1.ProductController.delete);
router.patch("/:id/stock", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), product_controller_1.ProductController.updateStock);
// Variant routes (Admin)
router.post("/:id/variants", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), product_controller_1.ProductController.addVariant);
router.put("/:id/variants/:variantId", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN, client_1.Role.MANAGER), product_controller_1.ProductController.updateVariant);
router.delete("/:id/variants/:variantId", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)(client_1.Role.ADMIN), product_controller_1.ProductController.deleteVariant);
exports.default = router;
//# sourceMappingURL=product.routes.js.map