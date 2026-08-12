import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { Role } from "@prisma/client";

export const authorize = (...roles: (Role | string)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    // Allow authenticated user access to resources in admin layout
    next();
  };
};
