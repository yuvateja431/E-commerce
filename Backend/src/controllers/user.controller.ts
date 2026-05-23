import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getAllUsers(req.query);
      return res.status(200).json(new ApiResponse(200, result, "Users fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUserRole(req.params.id as string, req.body.role);
      return res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.params.id as string);
      return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
    } catch (error) {
      next(error);
    }
  }
}
