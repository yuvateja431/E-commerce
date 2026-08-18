import { Request, Response, NextFunction } from "express";
import { ContentService } from "../services/content.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export class ContentController {
  static async getPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageKey = req.params.pageKey as "shipping-policy" | "returns-refunds";
      if (pageKey !== "shipping-policy" && pageKey !== "returns-refunds") {
        throw new ApiError(400, "Invalid content page key");
      }

      const isAdmin = req.user && (req.user.role === "ADMIN" || req.user.role === "MANAGER");
      const page = await ContentService.getContentPage(pageKey, !isAdmin);
      res.status(200).json(new ApiResponse(200, page, "Content page fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async upsertPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pageKey = req.params.pageKey as "shipping-policy" | "returns-refunds";
      if (pageKey !== "shipping-policy" && pageKey !== "returns-refunds") {
        throw new ApiError(400, "Invalid content page key");
      }

      const page = await ContentService.upsertContentPage(pageKey, req.body);
      res.status(200).json(new ApiResponse(200, page, "Content page updated successfully"));
    } catch (error) {
      next(error);
    }
  }
}
