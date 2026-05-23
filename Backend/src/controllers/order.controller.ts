import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

export const OrderController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const order = await OrderService.createOrder(userId, req.body);
    res.status(201).json({
      status: 'success',
      data: order
    });
  }),

  getUserOrders: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const orders = await OrderService.getOrders(userId);
    res.status(200).json({
      status: 'success',
      data: orders
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const order = await OrderService.getOrderById(id);
    
    if (req.user!.role === 'USER' && order.userId !== req.user!.id) {
      throw new ApiError(403, 'Not authorized to access this order');
    }
    
    res.status(200).json({
      status: 'success',
      data: order
    });
  }),

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const result = await OrderService.getAllOrders(req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  }),

  // New count endpoint
  getCount: asyncHandler(async (req: Request, res: Response) => {
    const count = await OrderService.getOrderCount();
    res.status(200).json({
      status: 'success',
      data: { count }
    });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus(id, status);
    res.status(200).json({
      status: 'success',
      data: order
    });
  }),
};
