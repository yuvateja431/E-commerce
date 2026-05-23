import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      let errors: any[] = [];
      if (error instanceof ZodError) {
        const zodIssues = (error as any).errors ?? (error as any).issues ?? [];
        errors = zodIssues.map((issue: any) => ({
          field: issue.path ? issue.path.join('.') : '',
          message: issue.message,
        }));
        console.error("[Validation Error Details]:", JSON.stringify(errors, null, 2));
        console.error("[Request Body]:", JSON.stringify(req.body, null, 2));
      } else {
        console.error("[Validation Unexpected Error]:", error);
      }
      return next(new ApiError(400, "Validation Error", errors));
    }
  };
};
