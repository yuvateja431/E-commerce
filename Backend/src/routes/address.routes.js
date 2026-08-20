import { Router } from 'express';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress, } from '../controllers/checkout/address.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
const router = Router();
router.use(authenticate);
// Fetch all addresses for the logged-in user
router.get('/addresses', getAddresses);
// Create a new address
router.post('/addresses', createAddress);
// Update an existing address
router.put('/addresses/:id', updateAddress);
// Delete an address
router.delete('/addresses/:id', deleteAddress);
// Set an address as default
router.patch('/addresses/:id/default', setDefaultAddress);
export default router;
