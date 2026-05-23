"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
exports.orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "Product ID is required"),
    quantity: zod_1.z
        .number()
        .int()
        .positive("Quantity must be at least 1"),
    price: zod_1.z
        .number()
        .nonnegative(),
});
exports.orderSchema = zod_1.z.object({
    shippingAddress: zod_1.z.object({
        street: zod_1.z.string().min(1, "Street is required"),
        city: zod_1.z.string().min(1, "City is required"),
        state: zod_1.z.string().min(1, "State is required"),
        zipCode: zod_1.z.string().min(1, "Zip code is required"),
        country: zod_1.z.string().min(1, "Country is required"),
    }),
    paymentMethod: zod_1.z.enum(["CARD", "UPI", "COD", "STRIPE", "RAZORPAY"]),
    // Optional coupon code for discounts
    couponCode: zod_1.z.string().optional(),
});
//# sourceMappingURL=order.validator.js.map