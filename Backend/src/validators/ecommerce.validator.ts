import { z } from "zod";

const productBaseSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  discountPrice: z.number().nonnegative("Discount price must be 0 or greater").optional().nullable(),
  categoryId: z.string().uuid("Category is required"),
  images: z.array(z.string().min(1, "Image path or URL is required")).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().int().nonnegative("Stock quantity must be 0 or greater").optional(),
  status: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PREORDER", "DRAFT"]).optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name is required"),
    value: z.string().min(1, "Variant value is required"),
    additionalPrice: z.number().nonnegative().optional(),
    stockQuantity: z.number().int().nonnegative().optional(),
  })).optional(),
});

export const createProductSchema = productBaseSchema.refine(data => {
  if (data.discountPrice !== undefined && data.discountPrice !== null) {
    return data.discountPrice < data.price;
  }
  return true;
}, {
  message: "Discount price must be less than price",
  path: ["discountPrice"],
});

export const updateProductSchema = productBaseSchema.partial().refine(data => {
  if (data.discountPrice !== undefined && data.discountPrice !== null && data.price !== undefined) {
    return data.discountPrice < data.price;
  }
  return true;
}, {
  message: "Discount price must be less than price",
  path: ["discountPrice"],
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const checkoutSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
  paymentMethod: z.enum(["CARD", "UPI", "COD"]),
  couponCode: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(1),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  minOrderValue: z.number().nonnegative().optional(),
  expiryDate: z.string().transform((str) => new Date(str)),
  isActive: z.boolean().optional(),
});
