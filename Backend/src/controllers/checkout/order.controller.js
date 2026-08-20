import { OrderService } from '../../services/order.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';
export const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, 'Unauthorized');
    }
    const order = await OrderService.createOrder(userId, req.body);
    res.status(201).json({ status: 'success', data: order });
});
export const getOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const order = await OrderService.getOrderById(id);
    if (!order) {
        throw new ApiError(404, 'Order not found');
    }
    // Ensure user can only access own order unless admin
    const userId = req.user?.id;
    if (req.user?.role === 'USER' && order.userId !== userId) {
        throw new ApiError(403, 'Not authorized');
    }
    res.status(200).json({ status: 'success', data: order });
});
