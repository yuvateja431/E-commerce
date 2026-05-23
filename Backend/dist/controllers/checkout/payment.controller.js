"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createRazorpayOrder = exports.createPaymentIntent = void 0;
const order_service_1 = require("../../services/order.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/** Create Stripe payment intent (stub for demo) */
exports.createPaymentIntent = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // In a real implementation you would call Stripe SDK here.
    // For now we just return a dummy client secret.
    res.status(200).json({ clientSecret: 'pi_dummy_secret' });
});
/** Create Razorpay order (stub for demo) */
exports.createRazorpayOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // In a real implementation you would call Razorpay SDK here.
    // Return a dummy order id for the frontend.
    res.status(200).json({ orderId: 'razorpay_dummy_order' });
});
/** Verify payment and update order status */
exports.verifyPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { orderId, paymentId, status } = req.body;
    if (!orderId || !paymentId || !status) {
        throw new ApiError_1.ApiError(400, 'Missing payment verification fields');
    }
    // Fetch the order and ensure it exists
    const order = await order_service_1.OrderService.getOrderById(orderId);
    if (!order) {
        throw new ApiError_1.ApiError(404, 'Order not found');
    }
    // Update order status based on payment result
    const newStatus = status.toUpperCase() === 'PAID' || status.toUpperCase() === 'SUCCESS' ? 'PROCESSING' : 'PENDING';
    await prisma.order.update({
        where: { id: orderId },
        data: {
            status: newStatus,
            paymentStatus: status,
            // Optionally store paymentId if you have a column for it
        },
    });
    res.status(200).json({ status: 'success', data: { orderId, paymentId, paymentStatus: status } });
});
//# sourceMappingURL=payment.controller.js.map