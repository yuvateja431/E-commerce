import { OrderService } from '../../services/order.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
/** Create Stripe payment intent (stub for demo) */
export const createPaymentIntent = asyncHandler(async (req, res) => {
    // In a real implementation you would call Stripe SDK here.
    // For now we just return a dummy client secret.
    res.status(200).json({ clientSecret: 'pi_dummy_secret' });
});
/** Create Razorpay order (stub for demo) */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
    // In a real implementation you would call Razorpay SDK here.
    // Return a dummy order id for the frontend.
    res.status(200).json({ orderId: 'razorpay_dummy_order' });
});
/** Verify payment and update order status */
export const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, status } = req.body;
    if (!orderId || !paymentId || !status) {
        throw new ApiError(400, 'Missing payment verification fields');
    }
    // Fetch the order and ensure it exists
    const order = await OrderService.getOrderById(orderId);
    if (!order) {
        throw new ApiError(404, 'Order not found');
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
