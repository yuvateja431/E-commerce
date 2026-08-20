import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
const prisma = new PrismaClient();
export class FAQService {
    static async getAllFAQs(status, search) {
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search && search.trim()) {
            const q = search.trim();
            where.OR = [
                { question: { contains: q, mode: "insensitive" } },
                { answer: { contains: q, mode: "insensitive" } },
            ];
        }
        const faqs = await prisma.fAQ.findMany({
            where,
            orderBy: [
                { displayOrder: "asc" },
                { createdAt: "desc" },
            ],
        });
        return faqs;
    }
    static async getFAQById(id) {
        const faq = await prisma.fAQ.findUnique({
            where: { id },
        });
        if (!faq) {
            throw new ApiError(404, "FAQ not found");
        }
        return faq;
    }
    static async createFAQ(data) {
        const faq = await prisma.fAQ.create({
            data: {
                question: data.question.trim(),
                answer: data.answer.trim(),
                displayOrder: data.displayOrder ?? 0,
                status: data.status ?? "Active",
            },
        });
        return faq;
    }
    static async updateFAQ(id, data) {
        await this.getFAQById(id);
        const updateData = {};
        if (data.question !== undefined)
            updateData.question = data.question.trim();
        if (data.answer !== undefined)
            updateData.answer = data.answer.trim();
        if (data.displayOrder !== undefined)
            updateData.displayOrder = data.displayOrder;
        if (data.status !== undefined)
            updateData.status = data.status;
        const updated = await prisma.fAQ.update({
            where: { id },
            data: updateData,
        });
        return updated;
    }
    static async deleteFAQ(id) {
        await this.getFAQById(id);
        await prisma.fAQ.delete({
            where: { id },
        });
    }
}
