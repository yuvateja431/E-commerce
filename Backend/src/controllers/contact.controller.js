import { ContactService } from "../services/contact.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class ContactController {
    /* ================= Contact Settings ================= */
    static async getSettings(req, res, next) {
        try {
            const isAdmin = req.user && (req.user.role === "ADMIN" || req.user.role === "MANAGER");
            const settings = await ContactService.getContactSettings(!isAdmin);
            res.status(200).json(new ApiResponse(200, settings, "Contact settings fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateSettings(req, res, next) {
        try {
            const settings = await ContactService.updateContactSettings(req.body);
            res.status(200).json(new ApiResponse(200, settings, "Contact settings updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    /* ================= Contact Messages ================= */
    static async createMessage(req, res, next) {
        try {
            const message = await ContactService.createContactMessage(req.body);
            res.status(201).json(new ApiResponse(201, message, "Contact message submitted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllMessages(req, res, next) {
        try {
            const { status, search } = req.query;
            const messages = await ContactService.getAllContactMessages(status, search);
            res.status(200).json(new ApiResponse(200, messages, "Contact messages fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async getMessageById(req, res, next) {
        try {
            const message = await ContactService.getContactMessageById(req.params.id);
            res.status(200).json(new ApiResponse(200, message, "Contact message fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateMessageStatus(req, res, next) {
        try {
            const message = await ContactService.updateContactMessageStatus(req.params.id, req.body);
            res.status(200).json(new ApiResponse(200, message, "Contact message status updated"));
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteMessage(req, res, next) {
        try {
            await ContactService.deleteContactMessage(req.params.id);
            res.status(200).json(new ApiResponse(200, {}, "Contact message deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
