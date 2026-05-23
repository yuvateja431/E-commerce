"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/checkout/payment.controller");
const router = (0, express_1.Router)();
// Stripe payment intent creation
router.post('/payments/create-intent', payment_controller_1.createPaymentIntent);
// Razorpay order creation
router.post('/payments/create-order', payment_controller_1.createRazorpayOrder);
// Verify payment signature / status
router.post('/payments/verify', payment_controller_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map