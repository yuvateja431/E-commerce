"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressValidator = void 0;
const zod_1 = require("zod");
exports.addressValidator = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    phone: zod_1.z.string().min(1, "Phone number is required"),
    addressLine1: zod_1.z.string().min(1, "Address line 1 is required"),
    addressLine2: zod_1.z.string().optional(),
    landmark: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, "City is required"),
    state: zod_1.z.string().min(1, "State is required"),
    postalCode: zod_1.z.string().min(1, "Postal code is required"),
    country: zod_1.z.string().min(1, "Country is required"),
    isDefault: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=address.validator.js.map