import { FAQService } from "../services/faq.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class FAQController {
    static async getAll(req, res, next) {
        try {
            const { status, search } = req.query;
            const faqs = await FAQService.getAllFAQs(status, search);
            res.status(200).json(new ApiResponse(200, faqs, "FAQs fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const faq = await FAQService.getFAQById(req.params.id);
            res.status(200).json(new ApiResponse(200, faq, "FAQ fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            const faq = await FAQService.createFAQ(req.body);
            res.status(201).json(new ApiResponse(201, faq, "FAQ created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const faq = await FAQService.updateFAQ(req.params.id, req.body);
            res.status(200).json(new ApiResponse(200, faq, "FAQ updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await FAQService.deleteFAQ(req.params.id);
            res.status(200).json(new ApiResponse(200, {}, "FAQ deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
