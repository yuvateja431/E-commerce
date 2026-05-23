"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/checkout/address.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Fetch all addresses for the logged-in user
router.get('/addresses', address_controller_1.getAddresses);
// Create a new address
router.post('/addresses', address_controller_1.createAddress);
// Update an existing address
router.put('/addresses/:id', address_controller_1.updateAddress);
// Delete an address
router.delete('/addresses/:id', address_controller_1.deleteAddress);
// Set an address as default
router.patch('/addresses/:id/default', address_controller_1.setDefaultAddress);
exports.default = router;
//# sourceMappingURL=address.routes.js.map