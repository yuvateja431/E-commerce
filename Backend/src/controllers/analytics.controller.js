import { AnalyticsService } from "../services/analytics.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class AnalyticsController {
    static async getStats(req, res, next) {
        try {
            const stats = await AnalyticsService.getDashboardStats();
            return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
