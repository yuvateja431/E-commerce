import { z } from "zod";
export const createFAQSchema = z.object({
    body: z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
        displayOrder: z.number().int().min(0, "Display order must be a non-negative integer").optional(),
        status: z.enum(["Active", "Inactive"]).optional(),
    }),
});
export const updateFAQSchema = z.object({
    body: z.object({
        question: z.string().min(1, "Question cannot be empty").optional(),
        answer: z.string().min(1, "Answer cannot be empty").optional(),
        displayOrder: z.number().int().min(0, "Display order must be a non-negative integer").optional(),
        status: z.enum(["Active", "Inactive"]).optional(),
    }),
});
