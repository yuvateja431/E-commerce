import { Request, Response, NextFunction } from "express";
import { FAQService } from "../services/faq.service";
import { ApiResponse } from "../utils/ApiResponse";

export class FAQController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search } = req.query;
      const faqs = await FAQService.getAllFAQs(
        status as string | undefined,
        search as string | undefined
      );
      res.status(200).json(new ApiResponse(200, faqs, "FAQs fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faq = await FAQService.getFAQById(req.params.id as string);
      res.status(200).json(new ApiResponse(200, faq, "FAQ fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faq = await FAQService.createFAQ(req.body);
      res.status(201).json(new ApiResponse(201, faq, "FAQ created successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faq = await FAQService.updateFAQ(req.params.id as string, req.body);
      res.status(200).json(new ApiResponse(200, faq, "FAQ updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await FAQService.deleteFAQ(req.params.id as string);
      res.status(200).json(new ApiResponse(200, {}, "FAQ deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
