"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const ApiError_1 = require("../utils/ApiError");
exports.OrderController = {
    create: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const order = await order_service_1.OrderService.createOrder(userId, req.body);
        res.status(201).json({
            status: 'success',
            data: order
        });
    }),
    getUserOrders: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user.id;
        const orders = await order_service_1.OrderService.getOrders(userId);
        res.status(200).json({
            status: 'success',
            data: orders
        });
    }),
    getById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const order = await order_service_1.OrderService.getOrderById(id);
        if (req.user.role === 'USER' && order.userId !== req.user.id) {
            throw new ApiError_1.ApiError(403, 'Not authorized to access this order');
        }
        res.status(200).json({
            status: 'success',
            data: order
        });
    }),
    getAll: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await order_service_1.OrderService.getAllOrders(req.query);
        res.status(200).json({
            status: 'success',
            data: result
        });
    }),
    // New count endpoint
    getCount: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const count = await order_service_1.OrderService.getOrderCount();
        res.status(200).json({
            status: 'success',
            data: { count }
        });
    }),
    updateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        const order = await order_service_1.OrderService.updateOrderStatus(id, status);
        res.status(200).json({
            status: 'success',
            data: order
        });
    }),
};
//# sourceMappingURL=order.controller.js.map