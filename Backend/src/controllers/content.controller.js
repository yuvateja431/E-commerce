import { ContentService } from "../services/content.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
export class ContentController {
    static async getPage(req, res, next) {
        try {
            const pageKey = req.params.pageKey;
            if (pageKey !== "shipping-policy" && pageKey !== "returns-refunds") {
                throw new ApiError(400, "Invalid content page key");
            }
            const isAdmin = req.user && (req.user.role === "ADMIN" || req.user.role === "MANAGER");
            const page = await ContentService.getContentPage(pageKey, !isAdmin);
            res.status(200).json(new ApiResponse(200, page, "Content page fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async upsertPage(req, res, next) {
        try {
            const pageKey = req.params.pageKey;
            if (pageKey !== "shipping-policy" && pageKey !== "returns-refunds") {
                throw new ApiError(400, "Invalid content page key");
            }
            const page = await ContentService.upsertContentPage(pageKey, req.body);
            res.status(200).json(new ApiResponse(200, page, "Content page updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
