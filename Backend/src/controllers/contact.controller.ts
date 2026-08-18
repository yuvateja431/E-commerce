import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services/contact.service";
import { ApiResponse } from "../utils/ApiResponse";

export class ContactController {
  /* ================= Contact Settings ================= */
  static async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = req.user && (req.user.role === "ADMIN" || req.user.role === "MANAGER");
      const settings = await ContactService.getContactSettings(!isAdmin);
      res.status(200).json(new ApiResponse(200, settings, "Contact settings fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await ContactService.updateContactSettings(req.body);
      res.status(200).json(new ApiResponse(200, settings, "Contact settings updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  /* ================= Contact Messages ================= */
  static async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await ContactService.createContactMessage(req.body);
      res.status(201).json(new ApiResponse(201, message, "Contact message submitted successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getAllMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search } = req.query;
      const messages = await ContactService.getAllContactMessages(
        status as string | undefined,
        search as string | undefined
      );
      res.status(200).json(new ApiResponse(200, messages, "Contact messages fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async getMessageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await ContactService.getContactMessageById(req.params.id as string);
      res.status(200).json(new ApiResponse(200, message, "Contact message fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateMessageStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await ContactService.updateContactMessageStatus(
        req.params.id as string,
        req.body
      );
      res.status(200).json(new ApiResponse(200, message, "Contact message status updated"));
    } catch (error) {
      next(error);
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ContactService.deleteContactMessage(req.params.id as string);
      res.status(200).json(new ApiResponse(200, {}, "Contact message deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
