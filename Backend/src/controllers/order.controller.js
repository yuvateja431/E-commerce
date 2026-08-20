import { OrderService } from '../services/order.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
export const OrderController = {
    create: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const order = await OrderService.createOrder(userId, req.body);
        res.status(201).json({
            status: 'success',
            data: order
        });
    }),
    getUserOrders: asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const orders = await OrderService.getOrders(userId);
        res.status(200).json({
            status: 'success',
            data: orders
        });
    }),
    getById: asyncHandler(async (req, res) => {
        const id = req.params.id;
        const order = await OrderService.getOrderById(id);
        if (req.user.role === 'USER' && order.userId !== req.user.id) {
            throw new ApiError(403, 'Not authorized to access this order');
        }
        res.status(200).json({
            status: 'success',
            data: order
        });
    }),
    getAll: asyncHandler(async (req, res) => {
        const result = await OrderService.getAllOrders(req.query);
        res.status(200).json({
            status: 'success',
            data: result
        });
    }),
    // New count endpoint
    getCount: asyncHandler(async (req, res) => {
        const count = await OrderService.getOrderCount();
        res.status(200).json({
            status: 'success',
            data: { count }
        });
    }),
    updateStatus: asyncHandler(async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        const order = await OrderService.updateOrderStatus(id, status);
        res.status(200).json({
            status: 'success',
            data: order
        });
    }),
};
