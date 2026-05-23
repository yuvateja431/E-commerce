"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class AnalyticsController {
    static async getStats(req, res, next) {
        try {
            const stats = await analytics_service_1.AnalyticsService.getDashboardStats();
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, stats, "Dashboard stats fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analytics.controller.js.map