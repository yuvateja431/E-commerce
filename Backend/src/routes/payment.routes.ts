import { Router } from 'express';
import {
  createPaymentIntent,
  createRazorpayOrder,
  verifyPayment,
} from '../controllers/checkout/payment.controller';

const router = Router();

// Stripe payment intent creation
router.post('/payments/create-intent', createPaymentIntent);

// Razorpay order creation
router.post('/payments/create-order', createRazorpayOrder);

// Verify payment signature / status
router.post('/payments/verify', verifyPayment);

export default router;
