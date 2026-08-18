import { PrismaClient } from "@prisma/client";
import { CreateFAQDTO, UpdateFAQDTO, FAQItem } from "../types/cms.types";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

export class FAQService {
  static async getAllFAQs(status?: string, search?: string): Promise<FAQItem[]> {
    const where: any = {};

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

    return faqs as FAQItem[];
  }

  static async getFAQById(id: string): Promise<FAQItem> {
    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new ApiError(404, "FAQ not found");
    }

    return faq as FAQItem;
  }

  static async createFAQ(data: CreateFAQDTO): Promise<FAQItem> {
    const faq = await prisma.fAQ.create({
      data: {
        question: data.question.trim(),
        answer: data.answer.trim(),
        displayOrder: data.displayOrder ?? 0,
        status: data.status ?? "Active",
      },
    });

    return faq as FAQItem;
  }

  static async updateFAQ(id: string, data: UpdateFAQDTO): Promise<FAQItem> {
    await this.getFAQById(id);

    const updateData: any = {};
    if (data.question !== undefined) updateData.question = data.question.trim();
    if (data.answer !== undefined) updateData.answer = data.answer.trim();
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.fAQ.update({
      where: { id },
      data: updateData,
    });

    return updated as FAQItem;
  }

  static async deleteFAQ(id: string): Promise<void> {
    await this.getFAQById(id);

    await prisma.fAQ.delete({
      where: { id },
    });
  }
}
