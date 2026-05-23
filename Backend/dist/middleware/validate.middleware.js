"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = require("../utils/ApiError");
const validate = (schema) => {
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
            if (error instanceof zod_1.ZodError) {
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
            return next(new ApiError_1.ApiError(400, "Validation Error", errors));
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map