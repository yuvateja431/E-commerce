import { UserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export class UserController {
    static async getAll(req, res, next) {
        try {
            const result = await UserService.getAllUsers(req.query);
            return res.status(200).json(new ApiResponse(200, result, "Users fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateRole(req, res, next) {
        try {
            const user = await UserService.updateUserRole(req.params.id, req.body.role);
            return res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await UserService.deleteUser(req.params.id);
            return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
