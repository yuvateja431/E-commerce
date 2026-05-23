"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_controller_1 = require("../controllers/checkout/address.controller");
const payment_controller_1 = require("../controllers/checkout/payment.controller");
const order_controller_1 = require("../controllers/checkout/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Address Management
router.get('/addresses', address_controller_1.getAddresses);
router.post('/addresses', address_controller_1.createAddress);
router.put('/addresses/:id', address_controller_1.updateAddress);
router.delete('/addresses/:id', address_controller_1.deleteAddress);
router.patch('/addresses/:id/default', address_controller_1.setDefaultAddress);
// Payment
router.post('/payments/create-intent', payment_controller_1.createPaymentIntent); // Stripe
router.post('/payments/create-order', payment_controller_1.createRazorpayOrder); // Razorpay
router.post('/payments/verify', payment_controller_1.verifyPayment);
// Order
router.post('/orders/checkout', order_controller_1.createOrder); // added for frontend compatibility
exports.default = router;
//# sourceMappingURL=checkout.routes.js.map