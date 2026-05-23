"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = void 0;
const zod_1 = require("zod");
exports.paymentSchema = zod_1.z.object({
    // Accepted payment methods must match the enum used in the frontend
    paymentMethod: zod_1.z.enum(["CARD", "UPI", "COD", "STRIPE", "RAZORPAY"]),
    amount: zod_1.z
        .number()
        .positive("Amount must be greater than zero"),
    currency: zod_1.z.string().default("INR"),
    // Optional order reference (used for verification steps)
    orderId: zod_1.z.string().optional(),
});
//# sourceMappingURL=payment.validator.js.map