import { z } from "zod";
export const paymentSchema = z.object({
    // Accepted payment methods must match the enum used in the frontend
    paymentMethod: z.enum(["CARD", "UPI", "COD", "STRIPE", "RAZORPAY"]),
    amount: z
        .number()
        .positive("Amount must be greater than zero"),
    currency: z.string().default("INR"),
    // Optional order reference (used for verification steps)
    orderId: z.string().optional(),
});
