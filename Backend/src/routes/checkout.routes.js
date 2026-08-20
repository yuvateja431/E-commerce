import { Router } from 'express';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/checkout/address.controller.js';
import { createPaymentIntent, createRazorpayOrder, verifyPayment } from '../controllers/checkout/payment.controller.js';
import { createOrder } from '../controllers/checkout/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = Router();
router.use(authenticate);
// Address Management
router.get('/addresses', getAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/default', setDefaultAddress);
// Payment
router.post('/payments/create-intent', createPaymentIntent); // Stripe
router.post('/payments/create-order', createRazorpayOrder); // Razorpay
router.post('/payments/verify', verifyPayment);
// Order
router.post('/orders/checkout', createOrder); // added for frontend compatibility
export default router;
