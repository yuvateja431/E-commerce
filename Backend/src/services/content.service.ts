import { PrismaClient } from "@prisma/client";
import { ContentPageItem, UpsertContentPageDTO } from "../types/cms.types";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

const DEFAULT_PAGES: Record<string, { title: string; shortDesc: string; content: string }> = {
  "shipping-policy": {
    title: "Shipping Policy",
    shortDesc: "Information about our shipping rates, delivery timelines, and logistics partners.",
    content: `<h2>1. Shipping & Processing Times</h2>
<p>All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.</p>

<h2>2. Standard Delivery Rates</h2>
<p>We offer Express and Standard Shipping across nationwide postal regions. Standard shipping takes 3-5 business days, while Express delivery arrives within 1-2 business days.</p>

<h2>3. Free Shipping Threshold</h2>
<p>Orders totaling over $50 qualify for <strong>FREE Standard Shipping</strong> automatically applied at checkout.</p>

<h2>4. Order Tracking</h2>
<p>Once your parcel is dispatched, a shipping confirmation email containing your tracking number and carrier portal details will be sent directly to your registered email address.</p>`,
  },
  "returns-refunds": {
    title: "Returns & Refunds Policy",
    shortDesc: "Guidelines regarding hassle-free item returns, replacement policy, and refund processing.",
    content: `<h2>1. 30-Day Return Guarantee</h2>
<p>If you are not entirely satisfied with your purchase, you may return unused and unopened items within 30 calendar days of delivery for a full refund or exchange.</p>

<h2>2. Conditions for Returns</h2>
<p>Items must be in original condition, with original tags intact and in original protective packaging. Personalized or clearanced items are non-refundable.</p>

<h2>3. How to Initiate a Return</h2>
<p>Please contact our Support Team or navigate to your Account Orders page. Select the order item and click <strong>Initiate Return</strong> to generate a return shipping label.</p>

<h2>4. Refund Processing Timeline</h2>
<p>Once your returned item is received and inspected at our warehouse, refunds are processed to your original payment method within 5-7 business days.</p>`,
  },
};

export class ContentService {
  static async getContentPage(pageKey: "shipping-policy" | "returns-refunds", activeOnly = false): Promise<ContentPageItem> {
    let page = await prisma.contentPage.findUnique({
      where: { pageKey },
    });

    if (!page) {
      const defaultData = DEFAULT_PAGES[pageKey] || {
        title: pageKey === "shipping-policy" ? "Shipping Policy" : "Returns & Refunds Policy",
        shortDesc: "",
        content: "<p>Policy content coming soon.</p>",
      };

      page = await prisma.contentPage.create({
        data: {
          pageKey,
          pageTitle: defaultData.title,
          shortDescription: defaultData.shortDesc,
          content: defaultData.content,
          status: "Active",
        },
      });
    }

    if (activeOnly && page.status !== "Active") {
      throw new ApiError(404, "Page content is currently offline or inactive.");
    }

    return page as ContentPageItem;
  }

  static async upsertContentPage(
    pageKey: "shipping-policy" | "returns-refunds",
    data: UpsertContentPageDTO
  ): Promise<ContentPageItem> {
    const updated = await prisma.contentPage.upsert({
      where: { pageKey },
      update: {
        pageTitle: data.pageTitle.trim(),
        shortDescription: data.shortDescription ? data.shortDescription.trim() : null,
        content: data.content,
        status: data.status ?? "Active",
      },
      create: {
        pageKey,
        pageTitle: data.pageTitle.trim(),
        shortDescription: data.shortDescription ? data.shortDescription.trim() : null,
        content: data.content,
        status: data.status ?? "Active",
      },
    });

    return updated as ContentPageItem;
  }
}
