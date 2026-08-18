import { z } from "zod";

export const createContactMessageSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email address is required"),
    phone: z.string().optional(),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
  }),
});

export const updateContactMessageStatusSchema = z.object({
  body: z.object({
    status: z.enum(["New", "Read", "Replied", "Closed"]),
  }),
});

export const updateContactSettingsSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, "Business name is required"),
    email: z.string().email("Valid email address is required"),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    googleMapsUrl: z.string().optional(),
    businessHours: z.string().optional(),
    facebookUrl: z.string().optional(),
    instagramUrl: z.string().optional(),
    twitterUrl: z.string().optional(),
    youtubeUrl: z.string().optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
  }),
});
