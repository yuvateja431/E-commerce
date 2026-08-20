import { z } from "zod";
export const upsertContentPageSchema = z.object({
    body: z.object({
        pageTitle: z.string().min(1, "Page title is required"),
        shortDescription: z.string().optional(),
        content: z.string().min(1, "Content is required"),
        status: z.enum(["Active", "Inactive"]).optional(),
    }),
});
