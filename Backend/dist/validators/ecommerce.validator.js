"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponSchema = exports.reviewSchema = exports.checkoutSchema = exports.createCategorySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const productBaseSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product Name is required"),
    slug: zod_1.z.string().optional(),
    description: zod_1.z.string().min(1, "Description is required"),
    price: zod_1.z.number().positive("Price must be greater than 0"),
    discountPrice: zod_1.z.number().nonnegative("Discount price must be 0 or greater").optional().nullable(),
    categoryId: zod_1.z.string().uuid("Category is required"),
    images: zod_1.z.array(zod_1.z.string().min(1, "Image path or URL is required")).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
    brand: zod_1.z.string().min(1, "Brand is required"),
    sku: zod_1.z.string().min(1, "SKU is required"),
    stock: zod_1.z.number().int().nonnegative("Stock quantity must be 0 or greater").optional(),
    status: zod_1.z.enum(["IN_STOCK", "OUT_OF_STOCK", "PREORDER", "DRAFT"]).optional(),
    isFeatured: zod_1.z.boolean().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    variants: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(1, "Variant name is required"),
        value: zod_1.z.string().min(1, "Variant value is required"),
        additionalPrice: zod_1.z.number().nonnegative().optional(),
        stockQuantity: zod_1.z.number().int().nonnegative().optional(),
    })).optional(),
});
exports.createProductSchema = productBaseSchema.refine(data => {
    if (data.discountPrice !== undefined && data.discountPrice !== null) {
        return data.discountPrice < data.price;
    }
    return true;
}, {
    message: "Discount price must be less than price",
    path: ["discountPrice"],
});
exports.updateProductSchema = productBaseSchema.partial().refine(data => {
    if (data.discountPrice !== undefined && data.discountPrice !== null && data.price !== undefined) {
        return data.discountPrice < data.price;
    }
    return true;
}, {
    message: "Discount price must be less than price",
    path: ["discountPrice"],
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().optional(),
});
exports.checkoutSchema = zod_1.z.object({
    shippingAddress: zod_1.z.object({
        street: zod_1.z.string().min(1),
        city: zod_1.z.string().min(1),
        state: zod_1.z.string().min(1),
        zipCode: zod_1.z.string().min(1),
        country: zod_1.z.string().min(1),
    }),
    paymentMethod: zod_1.z.enum(["CARD", "UPI", "COD"]),
    couponCode: zod_1.z.string().optional(),
});
exports.reviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().optional(),
});
exports.couponSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
    discountType: zod_1.z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: zod_1.z.number().positive(),
    minOrderValue: zod_1.z.number().nonnegative().optional(),
    expiryDate: zod_1.z.string().transform((str) => new Date(str)),
    isActive: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=ecommerce.validator.js.map