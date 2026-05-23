"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const ApiResponse_1 = require("../utils/ApiResponse");
class UserController {
    static async getAll(req, res, next) {
        try {
            const result = await user_service_1.UserService.getAllUsers(req.query);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, result, "Users fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async updateRole(req, res, next) {
        try {
            const user = await user_service_1.UserService.updateUserRole(req.params.id, req.body.role);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, user, "User role updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await user_service_1.UserService.deleteUser(req.params.id);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, "User deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map