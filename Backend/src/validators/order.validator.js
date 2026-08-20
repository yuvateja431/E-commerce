import { z } from "zod";
export const orderItemSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z
        .number()
        .int()
        .positive("Quantity must be at least 1"),
    price: z
        .number()
        .nonnegative(),
});
export const orderSchema = z.object({
    shippingAddress: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zipCode: z.string().min(1, "Zip code is required"),
        country: z.string().min(1, "Country is required"),
    }),
    paymentMethod: z.enum(["CARD", "UPI", "COD", "STRIPE", "RAZORPAY"]),
    // Optional coupon code for discounts
    couponCode: z.string().optional(),
});
