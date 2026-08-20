import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            let errors = [];
            if (error instanceof ZodError) {
                const zodIssues = error.errors ?? error.issues ?? [];
                errors = zodIssues.map((issue) => ({
                    field: issue.path ? issue.path.join('.') : '',
                    message: issue.message,
                }));
                console.error("[Validation Error Details]:", JSON.stringify(errors, null, 2));
                console.error("[Request Body]:", JSON.stringify(req.body, null, 2));
            }
            else {
                console.error("[Validation Unexpected Error]:", error);
            }
            return next(new ApiError(400, "Validation Error", errors));
        }
    };
};
