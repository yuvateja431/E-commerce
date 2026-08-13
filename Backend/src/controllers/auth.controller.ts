import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };

      return res
        .status(201)
        .cookie("accessToken", result.accessToken, options)
        .cookie("refreshToken", result.refreshToken, options)
        .json(new ApiResponse(201, result, "User registered successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };

      return res
        .status(200)
        .cookie("accessToken", result.accessToken, options)
        .cookie("refreshToken", result.refreshToken, options)
        .json(new ApiResponse(200, result, "User logged in successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const oldRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      const result = await AuthService.refreshToken(oldRefreshToken);

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };

      return res
        .status(200)
        .cookie("accessToken", result.accessToken, options)
        .cookie("refreshToken", result.refreshToken, options)
        .json(new ApiResponse(200, result, "Token refreshed successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.user.id);

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };

      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const origin =
        req.headers.origin ||
        (req.headers.referer ? new URL(req.headers.referer).origin : undefined);
      await AuthService.forgotPassword(req.body.email, origin);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "If your email exists, a reset link has been sent"));
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.resetPassword(req.params.token as string, req.body.password);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successful"));
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);
      return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile fetched successfully"));
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);
      return res
        .status(200)
        .json(new ApiResponse(200, user, "User profile updated successfully"));
    } catch (error) {
      next(error);
    }
  }
}
