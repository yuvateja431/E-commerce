import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Suppress expected JWT and token errors to keep console clean
  const suppressedMessages = [
    "jwt expired",
    "Invalid access token",
    "Refresh token is required",
    "Invalid or expired refresh token"
  ];

  if (!suppressedMessages.includes(err?.message)) {
    console.error("Error caught in middleware:", err);
  }

  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, err?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};
