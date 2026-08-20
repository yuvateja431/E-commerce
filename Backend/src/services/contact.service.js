import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
const prisma = new PrismaClient();
const DEFAULT_CONTACT_SETTINGS = {
    businessName: "E-Commerce Store Inc.",
    email: "support@ecommercestore.com",
    phone: "+1 (800) 555-0199",
    whatsapp: "+1 (800) 555-0199",
    address: "100 Innovation Boulevard, Tech Park",
    city: "San Francisco",
    state: "California",
    country: "United States",
    postalCode: "94105",
    googleMapsUrl: "https://maps.google.com",
    businessHours: "Monday - Friday: 9:00 AM - 6:00 PM EST",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    twitterUrl: "https://twitter.com",
    youtubeUrl: "https://youtube.com",
    status: "Active",
};
export class ContactService {
    /* ================= Contact Settings ================= */
    static async getContactSettings(activeOnly = false) {
        let settings = await prisma.contactSettings.findFirst();
        if (!settings) {
            settings = await prisma.contactSettings.create({
                data: {
                    businessName: DEFAULT_CONTACT_SETTINGS.businessName,
                    email: DEFAULT_CONTACT_SETTINGS.email,
                    phone: DEFAULT_CONTACT_SETTINGS.phone,
                    whatsapp: DEFAULT_CONTACT_SETTINGS.whatsapp,
                    address: DEFAULT_CONTACT_SETTINGS.address,
                    city: DEFAULT_CONTACT_SETTINGS.city,
                    state: DEFAULT_CONTACT_SETTINGS.state,
                    country: DEFAULT_CONTACT_SETTINGS.country,
                    postalCode: DEFAULT_CONTACT_SETTINGS.postalCode,
                    googleMapsUrl: DEFAULT_CONTACT_SETTINGS.googleMapsUrl,
                    businessHours: DEFAULT_CONTACT_SETTINGS.businessHours,
                    facebookUrl: DEFAULT_CONTACT_SETTINGS.facebookUrl,
                    instagramUrl: DEFAULT_CONTACT_SETTINGS.instagramUrl,
                    twitterUrl: DEFAULT_CONTACT_SETTINGS.twitterUrl,
                    youtubeUrl: DEFAULT_CONTACT_SETTINGS.youtubeUrl,
                    status: "Active",
                },
            });
        }
        if (activeOnly && settings.status !== "Active") {
            throw new ApiError(404, "Contact information is currently unavailable.");
        }
        return settings;
    }
    static async updateContactSettings(data) {
        const current = await this.getContactSettings(false);
        const updated = await prisma.contactSettings.update({
            where: { id: current.id },
            data: {
                businessName: data.businessName.trim(),
                email: data.email.trim(),
                phone: data.phone ? data.phone.trim() : null,
                whatsapp: data.whatsapp ? data.whatsapp.trim() : null,
                address: data.address ? data.address.trim() : null,
                city: data.city ? data.city.trim() : null,
                state: data.state ? data.state.trim() : null,
                country: data.country ? data.country.trim() : null,
                postalCode: data.postalCode ? data.postalCode.trim() : null,
                googleMapsUrl: data.googleMapsUrl ? data.googleMapsUrl.trim() : null,
                businessHours: data.businessHours ? data.businessHours.trim() : null,
                facebookUrl: data.facebookUrl ? data.facebookUrl.trim() : null,
                instagramUrl: data.instagramUrl ? data.instagramUrl.trim() : null,
                twitterUrl: data.twitterUrl ? data.twitterUrl.trim() : null,
                youtubeUrl: data.youtubeUrl ? data.youtubeUrl.trim() : null,
                status: data.status ?? "Active",
            },
        });
        return updated;
    }
    /* ================= Contact Messages ================= */
    static async createContactMessage(data) {
        const created = await prisma.contactMessage.create({
            data: {
                fullName: data.fullName.trim(),
                email: data.email.trim().toLowerCase(),
                phone: data.phone ? data.phone.trim() : null,
                subject: data.subject.trim(),
                message: data.message.trim(),
                status: "New",
            },
        });
        return created;
    }
    static async getAllContactMessages(status, search) {
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search && search.trim()) {
            const q = search.trim();
            where.OR = [
                { fullName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { subject: { contains: q, mode: "insensitive" } },
                { message: { contains: q, mode: "insensitive" } },
            ];
        }
        const messages = await prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return messages;
    }
    static async getContactMessageById(id) {
        const message = await prisma.contactMessage.findUnique({
            where: { id },
        });
        if (!message) {
            throw new ApiError(404, "Contact message not found");
        }
        return message;
    }
    static async updateContactMessageStatus(id, data) {
        await this.getContactMessageById(id);
        const updated = await prisma.contactMessage.update({
            where: { id },
            data: {
                status: data.status,
            },
        });
        return updated;
    }
    static async deleteContactMessage(id) {
        await this.getContactMessageById(id);
        await prisma.contactMessage.delete({
            where: { id },
        });
    }
}
