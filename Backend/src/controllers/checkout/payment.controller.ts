import { Request, Response } from 'express';
import { OrderService } from '../../services/order.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Create Stripe payment intent (stub for demo) */
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  // In a real implementation you would call Stripe SDK here.
  // For now we just return a dummy client secret.
  res.status(200).json({ clientSecret: 'pi_dummy_secret' });
});

/** Create Razorpay order (stub for demo) */
export const createRazorpayOrder = asyncHandler(async (req: Request, res: Response) => {
  // In a real implementation you would call Razorpay SDK here.
  // Return a dummy order id for the frontend.
  res.status(200).json({ orderId: 'razorpay_dummy_order' });
});

/** Verify payment and update order status */
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, paymentId, status } = req.body as {
    orderId: string;
    paymentId: string;
    status: string; // expected values: 'PAID', 'SUCCESS', 'COMPLETED'
  };

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
      status: newStatus as any,
      paymentStatus: status,
      // Optionally store paymentId if you have a column for it
    },
  });

  res.status(200).json({ status: 'success', data: { orderId, paymentId, paymentStatus: status } });
});
