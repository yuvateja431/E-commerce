import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export const generateInvoicePDF = (order: any, user?: any) => {
  if (!order) {
    toast.error("Order data not available");
    return;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();   // 210
  const pageH = doc.internal.pageSize.getHeight();  // 297
  const margin = 12;

  /* ── PALETTE ─────────────────────────────────────── */
  const bluePrimary   = [0, 56, 168];      // Royal Blue #0038A8
  const blueDark      = [6, 45, 130];      // Header Dark Blue #062D82
  const blueLightBg   = [240, 244, 255];   // Soft Blue #F0F4FF
  const blueBorder    = [218, 228, 255];   // Light Blue Border
  const greenPrimary  = [16, 185, 129];    // Emerald Green #10B981
  const greenDark     = [5, 150, 105];     // Dark Green #059669
  const greenLightBg  = [242, 249, 244];   // Soft Green #F2F9F4
  const greenBorder   = [209, 234, 215];   // Green Border
  const inkDark       = [15, 23, 42];      // Slate 900 #0F172A
  const inkMuted      = [100, 116, 139];   // Slate 500 #64748B
  const textLight     = [199, 210, 254];   // Light Indigo #C7D2FE
  const white         = [255, 255, 255];
  const cardBg        = [248, 250, 252];   // Slate 50 #F8FAFC
  const borderLine    = [226, 232, 240];   // Slate 200 #E2E8F0

  /* ── UTILITY HELPERS ────────────────────────────── */
  const setFill = (c: number[]) => doc.setFillColor(c[0], c[1], c[2]);
  const setTxt  = (c: number[]) => doc.setTextColor(c[0], c[1], c[2]);
  const setDraw = (c: number[]) => doc.setDrawColor(c[0], c[1], c[2]);

  /* ── 1. HEADER BANNER ────────────────────────────── */
  setFill(blueDark);
  doc.rect(0, 0, pageW, 38, "F");

  // Shopping Cart Icon Container (Rounded square)
  setFill([26, 92, 230]);
  doc.roundedRect(margin, 8, 14, 14, 3, 3, "F");

  // Cart Icon vector primitives
  setDraw(white);
  doc.setLineWidth(0.8);
  doc.line(margin + 3, 11, margin + 5, 11);
  doc.line(margin + 5, 11, margin + 6.5, 17);
  doc.line(margin + 6.5, 17, margin + 11.5, 17);
  doc.line(margin + 11.5, 17, margin + 12.5, 12);
  doc.line(margin + 5.3, 13, margin + 12.2, 13);
  doc.setFillColor(255, 255, 255);
  doc.circle(margin + 7, 19, 0.7, "F");
  doc.circle(margin + 11, 19, 0.7, "F");

  // Brand Name
  setTxt(white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("E-COMMERCE", margin + 18, 15);
  doc.text("STORE", margin + 18, 22);

  // Tagline
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setTxt(textLight);
  doc.text("Premium Online Shopping", margin + 18, 28.5);

  // TAX INVOICE Header (Right)
  setTxt(white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("TAX INVOICE", pageW - margin, 14, { align: "right" });

  // Invoice Number & Date
  const rawId = order.id ?? order._id ?? "ORDER";
  const invoiceNo = `INV-${rawId.slice(0, 8).toUpperCase()}`;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setTxt(white);
  doc.text(`Invoice No: ${invoiceNo}`, pageW - margin, 21, { align: "right" });

  // Calendar icon + Date
  doc.setFont("helvetica", "bold");
  doc.text(`Date: ${invoiceDate}`, pageW - margin, 28, { align: "right" });

  /* ── 2. INFO CARDS: SOLD BY + BILL TO / SHIP TO ─── */
  const cardY = 44;
  const cardW = 89;
  const cardH = 46;

  // Left Card: SOLD BY
  setFill(blueLightBg);
  setDraw(blueBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, cardY, cardW, cardH, 3, 3, "FD");

  // Store Icon Badge
  setFill([217, 228, 255]);
  doc.circle(margin + 8, cardY + 8, 4, "F");
  setDraw(bluePrimary);
  doc.setLineWidth(0.6);
  doc.line(margin + 5.5, cardY + 7, margin + 10.5, cardY + 7);
  doc.line(margin + 6, cardY + 7, margin + 6, cardY + 10);
  doc.line(margin + 10, cardY + 7, margin + 10, cardY + 10);
  doc.line(margin + 5, cardY + 10, margin + 11, cardY + 10);

  // Sold By Heading
  setTxt(bluePrimary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("SOLD BY", margin + 15, cardY + 9);

  setTxt(inkDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("E-Commerce Store Pvt. Ltd.", margin + 6, cardY + 18);

  setTxt(inkMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("12, Commerce Nagar, MG Road", margin + 6, cardY + 24);
  doc.text("Bengaluru, Karnataka - 560001", margin + 6, cardY + 30);
  doc.text("GSTIN: 29AABCU9603R1ZX", margin + 6, cardY + 36);

  // Mail Icon + Email
  setTxt(bluePrimary);
  doc.setFont("helvetica", "normal");
  doc.text("support@ecommercestore.com", margin + 6, cardY + 42);

  // Right Card: BILL TO / SHIP TO
  const rightX = pageW - margin - cardW;
  setFill(greenLightBg);
  setDraw(greenBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(rightX, cardY, cardW, cardH, 3, 3, "FD");

  // User Icon Badge
  setFill([213, 240, 220]);
  doc.circle(rightX + 8, cardY + 8, 4, "F");
  setFill(greenDark);
  doc.circle(rightX + 8, cardY + 6.5, 1.6, "F");
  doc.ellipse(rightX + 8, cardY + 10, 2.5, 1.2, "F");

  // Bill To Heading
  setTxt(greenDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("BILL TO / SHIP TO", rightX + 15, cardY + 9);

  // Customer Name
  const addr = order.address || order.shippingAddress;
  const custName = addr?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName}` : "Customer");

  setTxt(inkDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(custName.toUpperCase(), rightX + 6, cardY + 18);

  setTxt(inkMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  if (addr) {
    const line1 = addr.addressLine1 || addr.street || "";
    const line2 = addr.addressLine2 ? `, ${addr.addressLine2}` : "";
    doc.text(`${line1}${line2}`, rightX + 6, cardY + 24);
    doc.text(`${addr.city || ""}, ${addr.state || ""} - ${addr.postalCode || addr.zipCode || ""}`, rightX + 6, cardY + 30);
    doc.text(addr.country || "India", rightX + 6, cardY + 36);
  } else {
    doc.text("Address not on record", rightX + 6, cardY + 24);
  }

  // Customer Email
  const custEmail = user?.email || order.user?.email || "customer@email.com";
  setTxt(greenDark);
  doc.setFont("helvetica", "normal");
  doc.text(custEmail, rightX + 6, cardY + 42);

  /* ── 3. ORDER META ROW ───────────────────────────── */
  const metaY = 96;
  const metaH = 16;
  const metaW = pageW - margin * 2;

  setFill(cardBg);
  setDraw(borderLine);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, metaY, metaW, metaH, 3, 3, "FD");

  const colW = metaW / 4;

  // Col 1: ORDER ID
  setTxt(inkMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("ORDER ID", margin + 6, metaY + 6);
  setTxt(bluePrimary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`#${rawId.slice(0, 8).toUpperCase()}`, margin + 6, metaY + 12);

  // Col 2: PAYMENT METHOD
  const payMethod = (order.paymentMethod || "CARD").toUpperCase();
  setTxt(inkMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("PAYMENT METHOD", margin + colW + 6, metaY + 6);
  setTxt(inkDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(payMethod, margin + colW + 6, metaY + 12);

  // Col 3: ORDER DATE
  setTxt(inkMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("ORDER DATE", margin + colW * 2 + 6, metaY + 6);
  setTxt(inkDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(invoiceDate, margin + colW * 2 + 6, metaY + 12);

  // Col 4: STATUS BADGE
  const statusStr = (order.paymentStatus || order.status || "PAID").toUpperCase();
  setTxt(inkMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("STATUS", margin + colW * 3 + 6, metaY + 6);

  setFill([209, 250, 229]); // Light emerald
  doc.roundedRect(margin + colW * 3 + 6, metaY + 7.5, 20, 6, 3, 3, "F");
  setTxt(greenDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text(`✓ ${statusStr}`, margin + colW * 3 + 9, metaY + 11.5);

  /* ── 4. ITEMS TABLE ──────────────────────────────── */
  const tableY = 118;
  const tableItems = (order.items ?? []).map((item: any, idx: number) => {
    const unitPrice = Number(item.price);
    const qty       = item.quantity;
    const taxable   = unitPrice * qty;
    const gstRate   = 0.18;
    const gst       = taxable * gstRate;
    const total     = taxable + gst;
    return [
      String(idx + 1),
      item.product?.name ?? "Product Item",
      String(qty),
      `₹${unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      `₹${taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      "18%",
      `₹${gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      `₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    ];
  });

  autoTable(doc, {
    startY: tableY,
    head: [["#", "DESCRIPTION", "QTY", "UNIT PRICE", "TAXABLE AMT", "GST", "GST AMT", "TOTAL"]],
    body: tableItems,
    styles: {
      fontSize: 8,
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
      font: "helvetica",
      textColor: inkDark as any,
    },
    headStyles: {
      fillColor: bluePrimary as any,
      textColor: white as any,
      fontStyle: "bold",
      fontSize: 7.5,
      halign: "center",
      cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      1: { cellWidth: "auto" },
      2: { halign: "center", cellWidth: 12 },
      3: { halign: "right", cellWidth: 24 },
      4: { halign: "right", cellWidth: 25 },
      5: { halign: "center", cellWidth: 12 },
      6: { halign: "right", cellWidth: 22 },
      7: { halign: "right", cellWidth: 25, fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] as any },
    tableLineColor: borderLine as any,
    tableLineWidth: 0.1,
    margin: { left: margin, right: margin },
  });

  /* ── 5. PAYMENT STATUS & TOTALS SUMMARY ──────────── */
  const finalY: number = (doc as any).lastAutoTable?.finalY ?? tableY + 30;
  const summaryY = finalY + 6;

  // Left Box: PAYMENT STATUS
  const statusBoxW = 64;
  const statusBoxH = 38;
  setFill(greenLightBg);
  setDraw(greenPrimary);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, summaryY, statusBoxW, statusBoxH, 3, 3, "FD");

  // Large Green Check Circle
  setFill(greenPrimary);
  doc.circle(margin + 16, summaryY + 19, 8, "F");

  // White Checkmark path
  setDraw(white);
  doc.setLineWidth(1.2);
  doc.line(margin + 12.5, summaryY + 19, margin + 15, summaryY + 21.5);
  doc.line(margin + 15, summaryY + 21.5, margin + 19.5, summaryY + 16.5);

  setTxt(greenDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("PAYMENT STATUS", margin + 28, summaryY + 14);
  doc.setFontSize(14);
  doc.text(statusStr, margin + 28, summaryY + 24);

  // Right Box: TOTALS
  const totalsStartX = pageW - margin - 114;
  const totalsW      = 114;
  const subtotal     = (order.items ?? []).reduce((s: number, i: any) => s + Number(i.price) * i.quantity, 0);
  const totalGST     = subtotal * 0.18;
  const grandTotal   = Number(order.totalAmount ?? subtotal + totalGST);

  let ty = summaryY + 4;
  const drawRow = (label: string, value: string) => {
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(label, totalsStartX, ty);
    setTxt(inkDark);
    doc.setFont("helvetica", "bold");
    doc.text(value, pageW - margin, ty, { align: "right" });
    ty += 6.5;
  };

  drawRow("Subtotal (excl. GST):", `₹${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
  drawRow("CGST (9%):", `₹${(totalGST / 2).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
  drawRow("SGST (9%):", `₹${(totalGST / 2).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`);
  drawRow("Shipping:", "FREE");

  // Grand Total Bar
  const grandBarY = summaryY + 28;
  setFill(bluePrimary);
  doc.roundedRect(totalsStartX, grandBarY, totalsW, 11, 2, 2, "F");

  setTxt(white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("GRAND TOTAL:", totalsStartX + 4, grandBarY + 7.5);
  doc.setFontSize(12);
  doc.text(`₹${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, pageW - margin - 4, grandBarY + 7.5, { align: "right" });

  /* ── 6. TERMS & CONDITIONS CARD ──────────────────── */
  const termsY = summaryY + 44;
  const termsH = 24;

  setFill(blueLightBg);
  setDraw(blueBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, termsY, pageW - margin * 2, termsH, 3, 3, "FD");

  // Document Badge Icon
  setFill([217, 228, 255]);
  doc.circle(margin + 8, termsY + 8, 4, "F");
  setDraw(bluePrimary);
  doc.setLineWidth(0.6);
  doc.rect(margin + 6, termsY + 5.5, 4, 5);

  setTxt(bluePrimary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Terms & Conditions:", margin + 15, termsY + 9);

  setTxt(inkMuted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("• All sales are final. Returns accepted within 7 days of delivery.", margin + 15, termsY + 14);
  doc.text("• This is a computer-generated invoice and does not require a physical signature.", margin + 15, termsY + 18);
  doc.text("• For queries, contact us at support@ecommercestore.com or call 1800-123-4567.", margin + 15, termsY + 22);

  /* ── 7. FOOTER BAND ──────────────────────────────── */
  const footerY = pageH - 12;
  setFill(blueDark);
  doc.rect(0, footerY, pageW, 12, "F");

  // Dot Grid Pattern on left and right sides
  setFill([60, 110, 220]);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      doc.circle(10 + c * 2.5, footerY + 3 + r * 2.5, 0.4, "F");
      doc.circle(pageW - 20 + c * 2.5, footerY + 3 + r * 2.5, 0.4, "F");
    }
  }

  setTxt(white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("♥  Thank you for shopping with E-Commerce Store!", pageW / 2, footerY + 5, { align: "center" });

  setTxt(textLight);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("www.ecommercestore.com", pageW / 2, footerY + 9.5, { align: "center" });

  doc.save(`ECommerceStore_Invoice_${invoiceNo}.pdf`);
  toast.success("Invoice downloaded successfully!");
};
