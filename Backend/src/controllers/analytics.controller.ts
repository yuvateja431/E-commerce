import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "../services/analytics.service";
import { ApiResponse } from "../utils/ApiResponse";

export class AnalyticsController {
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AnalyticsService.getDashboardStats();
      return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
    } catch (error) {
      next(error);
    }
  }
}
