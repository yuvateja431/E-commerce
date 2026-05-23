"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.createOrder = void 0;
const order_service_1 = require("../../services/order.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
const ApiError_1 = require("../../utils/ApiError");
exports.createOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError_1.ApiError(401, 'Unauthorized');
    }
    const order = await order_service_1.OrderService.createOrder(userId, req.body);
    res.status(201).json({ status: 'success', data: order });
});
exports.getOrderById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const order = await order_service_1.OrderService.getOrderById(id);
    if (!order) {
        throw new ApiError_1.ApiError(404, 'Order not found');
    }
    // Ensure user can only access own order unless admin
    const userId = req.user?.id;
    if (req.user?.role === 'USER' && order.userId !== userId) {
        throw new ApiError_1.ApiError(403, 'Not authorized');
    }
    res.status(200).json({ status: 'success', data: order });
});
//# sourceMappingURL=order.controller.js.map