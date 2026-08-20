import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
export const generateInvoicePDF = (order, user) => {
    if (!order) {
        toast.error("Order data not available");
        return;
    }
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth(); // 210
    const pageH = doc.internal.pageSize.getHeight(); // 297
    const margin = 12;
    /* ── COLOR PALETTE (Matching Mockup Image 1 Exactly) ── */
    const bluePrimary = [10, 54, 157]; // Royal Blue #0A369D
    const blueDark = [6, 40, 120]; // Header Dark Blue #062878
    const blueLightBg = [242, 245, 253]; // Soft Blue Tint #F2F5FD
    const blueBorder = [221, 229, 251]; // Soft Blue Border #DDE5FB
    const blueIconBg = [217, 228, 255]; // Icon Badge Blue #D9E4FF
    const greenPrimary = [16, 185, 129]; // Emerald Green #10B981
    const greenDark = [5, 150, 105]; // Dark Green #059669
    const greenLightBg = [242, 249, 245]; // Soft Green Tint #F2F9F5
    const greenBorder = [209, 231, 215]; // Soft Green Border #D1E7D7
    const greenIconBg = [212, 238, 217]; // Icon Badge Green #D4EED9
    const inkDark = [17, 24, 39]; // Slate Dark #111827
    const inkMuted = [75, 85, 99]; // Slate Muted #4B5563
    const textLight = [192, 209, 255]; // Header Subtitle Light Blue #C0D1FF
    const white = [255, 255, 255];
    const cardBg = [248, 250, 252]; // Slate Card #F8FAFC
    const borderLine = [226, 232, 240]; // Border Line #E2E8F0
    /* ── DRAWING HELPERS ────────────────────────────── */
    const setFill = (c) => doc.setFillColor(c[0], c[1], c[2]);
    const setTxt = (c) => doc.setTextColor(c[0], c[1], c[2]);
    const setDraw = (c) => doc.setDrawColor(c[0], c[1], c[2]);
    // Format currency cleanly as "Rs. 1,599.00" or "Rs. 1,886.82" to avoid jsPDF font encoding corruption
    const fmtCurr = (num) => `Rs. ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    /* ── 1. HEADER BANNER (Full width with gradient curves) ── */
    setFill(bluePrimary);
    doc.rect(0, 0, pageW, 40, "F");
    // Subtle curved mesh circles in header right
    setFill([18, 70, 190]);
    doc.circle(pageW - 20, -10, 35, "F");
    setFill([26, 82, 210]);
    doc.circle(pageW - 10, -5, 22, "F");
    // Shopping Cart Logo Container
    setFill([30, 80, 216]);
    doc.roundedRect(margin, 8, 14, 14, 3.5, 3.5, "F");
    // White Shopping Cart Icon Vector
    setDraw(white);
    doc.setLineWidth(0.85);
    doc.line(margin + 3, 11.5, margin + 5, 11.5);
    doc.line(margin + 5, 11.5, margin + 6.5, 17.5);
    doc.line(margin + 6.5, 17.5, margin + 11.5, 17.5);
    doc.line(margin + 11.5, 17.5, margin + 12.5, 12.5);
    doc.line(margin + 5.3, 13.5, margin + 12.2, 13.5);
    doc.setFillColor(255, 255, 255);
    doc.circle(margin + 7, 19.5, 0.75, "F");
    doc.circle(margin + 11, 19.5, 0.75, "F");
    // Brand Name
    setTxt(white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("E-COMMERCE", margin + 18, 15);
    doc.text("STORE", margin + 18, 22);
    // Tagline
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    setTxt(textLight);
    doc.text("Premium Online Shopping", margin + 18, 28.5);
    // TAX INVOICE Header (Right aligned)
    setTxt(white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
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
    doc.text(`Invoice No: ${invoiceNo}`, pageW - margin, 21.5, { align: "right" });
    // Date Text
    doc.setFont("helvetica", "bold");
    doc.text(`Date: ${invoiceDate}`, pageW - margin, 28.5, { align: "right" });
    /* ── 2. INFO CARDS: SOLD BY + BILL TO / SHIP TO ─── */
    const cardY = 46;
    const cardW = 89;
    const cardH = 48;
    // Left Card: SOLD BY
    setFill(blueLightBg);
    setDraw(blueBorder);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, cardY, cardW, cardH, 3.5, 3.5, "FD");
    // Store Icon Circle Badge
    setFill(blueIconBg);
    doc.circle(margin + 9, cardY + 9, 4.5, "F");
    // Store Building Vector Icon inside badge
    setFill(bluePrimary);
    setDraw(bluePrimary);
    doc.setLineWidth(0.6);
    doc.rect(margin + 6.5, cardY + 8, 5, 4, "F");
    doc.line(margin + 6, cardY + 8, margin + 9, cardY + 5.5);
    doc.line(margin + 9, cardY + 5.5, margin + 12, cardY + 8);
    // Sold By Heading
    setTxt(bluePrimary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("SOLD BY", margin + 16, cardY + 10);
    // Company Name
    setTxt(inkDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text("E-Commerce Store Pvt. Ltd.", margin + 6, cardY + 19);
    // Address Lines
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("12, Commerce Nagar, MG Road", margin + 6, cardY + 25);
    doc.text("Bengaluru, Karnataka - 560001", margin + 6, cardY + 31);
    doc.text("GSTIN: 29AABCU9603R1ZX", margin + 6, cardY + 37);
    // Helper to draw clean envelope icon with fold flap matching Image 1 & 2
    const drawEnvelopeIcon = (eX, eY, color) => {
        setDraw(color);
        doc.setLineWidth(0.35);
        doc.roundedRect(eX, eY, 3.8, 2.7, 0.4, 0.4, "S");
        doc.line(eX, eY, eX + 1.9, eY + 1.35);
        doc.line(eX + 1.9, eY + 1.35, eX + 3.8, eY);
    };
    // Mail Icon Vector + Support Email
    drawEnvelopeIcon(margin + 6, cardY + 41.2, bluePrimary);
    setTxt(bluePrimary);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("support@ecommercestore.com", margin + 11.5, cardY + 43.3);
    // Right Card: BILL TO / SHIP TO
    const rightX = pageW - margin - cardW;
    setFill(greenLightBg);
    setDraw(greenBorder);
    doc.setLineWidth(0.35);
    doc.roundedRect(rightX, cardY, cardW, cardH, 3.5, 3.5, "FD");
    // User Icon Circle Badge
    setFill(greenIconBg);
    doc.circle(rightX + 9, cardY + 9, 4.5, "F");
    setFill(greenDark);
    doc.circle(rightX + 9, cardY + 7.2, 1.6, "F");
    doc.ellipse(rightX + 9, cardY + 11.2, 2.6, 1.3, "F");
    // Bill To Heading
    setTxt(greenDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("BILL TO / SHIP TO", rightX + 16, cardY + 10);
    // Customer Name
    const addr = order.address || order.shippingAddress;
    const rawName = addr?.fullName || (order.user?.firstName ? `${order.user.firstName} ${order.user.lastName}` : (user?.firstName ? `${user.firstName} ${user.lastName}` : "BACHU YUVATEJA"));
    const custName = rawName.trim().toUpperCase();
    setTxt(inkDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(custName, rightX + 6, cardY + 19);
    // Customer Address
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const streetLine = addr?.addressLine1 || addr?.street || "123 Main St";
    const cityStr = addr?.city || "New York";
    const stateStr = addr?.state || "NY";
    const zipStr = addr?.postalCode || addr?.zipCode || "10001";
    const countryStr = addr?.country || "USA";
    doc.text(streetLine, rightX + 6, cardY + 25);
    doc.text(`${cityStr}, ${stateStr} - ${zipStr}`, rightX + 6, cardY + 31);
    doc.text(countryStr, rightX + 6, cardY + 37);
    // Mail Icon Vector + Customer Email
    const custEmail = user?.email || order.user?.email || "customer@email.com";
    drawEnvelopeIcon(rightX + 6, cardY + 41.2, greenDark);
    setTxt(greenDark);
    doc.setFont("helvetica", "normal");
    doc.text(custEmail, rightX + 11.5, cardY + 43.3);
    /* ── 3. ORDER META ROW ───────────────────────────── */
    const metaY = 98;
    const metaH = 17;
    const metaW = pageW - margin * 2;
    setFill(cardBg);
    setDraw(borderLine);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, metaY, metaW, metaH, 3.5, 3.5, "FD");
    const colW = metaW / 4;
    // Col 1: ORDER ID
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("ORDER ID", margin + 6, metaY + 6);
    setTxt(bluePrimary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`#${rawId.slice(0, 8).toUpperCase()}`, margin + 6, metaY + 13);
    // Col 2: PAYMENT METHOD
    const payMethod = (order.paymentMethod || "CARD").toUpperCase();
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("PAYMENT METHOD", margin + colW + 6, metaY + 6);
    setTxt(inkDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(payMethod, margin + colW + 6, metaY + 13);
    // Col 3: ORDER DATE
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("ORDER DATE", margin + colW * 2 + 6, metaY + 6);
    setTxt(inkDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(invoiceDate, margin + colW * 2 + 6, metaY + 13);
    // Col 4: STATUS BADGE
    const statusStr = (order.paymentStatus || order.status || "PAID").toUpperCase();
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("STATUS", margin + colW * 3 + 6, metaY + 6);
    // Green Pill Badge
    setFill([209, 250, 229]); // Light emerald pill
    doc.roundedRect(margin + colW * 3 + 6, metaY + 8, 22, 6.5, 3, 3, "F");
    // Green circle check icon inside pill
    setFill(greenPrimary);
    doc.circle(margin + colW * 3 + 9.5, metaY + 11.25, 1.8, "F");
    setDraw(white);
    doc.setLineWidth(0.5);
    doc.line(margin + colW * 3 + 8.7, metaY + 11.25, margin + 9.3 + colW * 3, metaY + 12);
    doc.line(margin + colW * 3 + 9.3, metaY + 12, margin + 10.3 + colW * 3, metaY + 10.4);
    setTxt(greenDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(statusStr, margin + colW * 3 + 12.5, metaY + 12.5);
    /* ── 4. ITEMS TABLE ──────────────────────────────── */
    const tableY = 120;
    const tableItems = (order.items ?? []).map((item, idx) => {
        const unitPrice = Number(item.price);
        const qty = item.quantity;
        const taxable = unitPrice * qty;
        const gstRate = 0.18;
        const gst = taxable * gstRate;
        const total = taxable + gst;
        return [
            String(idx + 1),
            item.product?.name ?? "Product Item",
            String(qty),
            fmtCurr(unitPrice),
            fmtCurr(taxable),
            "18%",
            fmtCurr(gst),
            fmtCurr(total),
        ];
    });
    autoTable(doc, {
        startY: tableY,
        head: [["#", "DESCRIPTION", "QTY", "UNIT PRICE", "TAXABLE AMT", "GST", "GST AMT", "TOTAL"]],
        body: tableItems,
        styles: {
            fontSize: 8.5,
            cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
            font: "helvetica",
            textColor: inkDark,
        },
        headStyles: {
            fillColor: bluePrimary,
            textColor: white,
            fontStyle: "bold",
            fontSize: 8,
            halign: "center",
            cellPadding: { top: 4.5, bottom: 4.5, left: 3, right: 3 },
        },
        columnStyles: {
            0: { halign: "center", cellWidth: 8 },
            1: { cellWidth: "auto" },
            2: { halign: "center", cellWidth: 12 },
            3: { halign: "right", cellWidth: 26 },
            4: { halign: "right", cellWidth: 27 },
            5: { halign: "center", cellWidth: 12 },
            6: { halign: "right", cellWidth: 24 },
            7: { halign: "right", cellWidth: 27, fontStyle: "bold" },
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        tableLineColor: borderLine,
        tableLineWidth: 0.1,
        margin: { left: margin, right: margin },
    });
    /* ── 5. PAYMENT STATUS & TOTALS SUMMARY ──────────── */
    const finalY = doc.lastAutoTable?.finalY ?? tableY + 30;
    const summaryY = finalY + 6;
    // Left Box: PAYMENT STATUS
    const statusBoxW = 65;
    const statusBoxH = 40;
    setFill(greenLightBg);
    setDraw(greenDark);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, summaryY, statusBoxW, statusBoxH, 3.5, 3.5, "FD");
    // Outer Green Ring Vector
    setDraw(greenPrimary);
    doc.setLineWidth(0.8);
    doc.circle(margin + 17, summaryY + 20, 9.5, "S");
    // Large Green Circle Checkmark Badge
    setFill(greenPrimary);
    doc.circle(margin + 17, summaryY + 20, 7.5, "F");
    // White Checkmark Icon inside Circle
    setDraw(white);
    doc.setLineWidth(1.4);
    doc.line(margin + 13.5, summaryY + 20, margin + 16, summaryY + 22.5);
    doc.line(margin + 16, summaryY + 22.5, margin + 20.5, summaryY + 17);
    setTxt(greenDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("PAYMENT STATUS", margin + 29, summaryY + 15);
    doc.setFontSize(15);
    doc.text(statusStr, margin + 29, summaryY + 25);
    // Right Box: TOTALS
    const totalsStartX = pageW - margin - 114;
    const totalsW = 114;
    const subtotal = (order.items ?? []).reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const totalGST = subtotal * 0.18;
    const grandTotal = Number(order.totalAmount ?? subtotal + totalGST);
    let ty = summaryY + 4;
    const drawRow = (label, value) => {
        setTxt(inkMuted);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(label, totalsStartX, ty);
        setTxt(inkDark);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(value, pageW - margin, ty, { align: "right" });
        ty += 6.5;
    };
    drawRow("Subtotal (excl. GST):", fmtCurr(subtotal));
    drawRow("CGST (9%):", fmtCurr(totalGST / 2));
    drawRow("SGST (9%):", fmtCurr(totalGST / 2));
    drawRow("Shipping:", "FREE");
    // Grand Total Bar
    const grandBarY = summaryY + 29;
    setFill(bluePrimary);
    doc.roundedRect(totalsStartX, grandBarY, totalsW, 11.5, 2, 2, "F");
    setTxt(white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("GRAND TOTAL:", totalsStartX + 5, grandBarY + 7.5);
    doc.setFontSize(12.5);
    doc.text(fmtCurr(grandTotal), pageW - margin - 4, grandBarY + 7.5, { align: "right" });
    /* ── 6. TERMS & CONDITIONS CARD ──────────────────── */
    const termsY = summaryY + 45;
    const termsH = 25;
    setFill(blueLightBg);
    setDraw(blueBorder);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, termsY, pageW - margin * 2, termsH, 3.5, 3.5, "FD");
    // Document Badge Icon Vector (Solid blue rounded box + folded white paper)
    setFill(blueIconBg);
    doc.roundedRect(margin + 5, termsY + 5, 8.5, 8.5, 2, 2, "F");
    // White paper vector inside
    setFill(bluePrimary);
    doc.roundedRect(margin + 7.2, termsY + 6.8, 4.2, 5, 0.5, 0.5, "F");
    setDraw(white);
    doc.setLineWidth(0.5);
    doc.line(margin + 8, termsY + 8.2, margin + 10.2, termsY + 8.2);
    doc.line(margin + 8, termsY + 9.8, margin + 10.2, termsY + 9.8);
    setTxt(bluePrimary);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Terms & Conditions:", margin + 17, termsY + 10);
    setTxt(inkMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("• All sales are final. Returns accepted within 7 days of delivery.", margin + 17, termsY + 15);
    doc.text("• This is a computer-generated invoice and does not require a physical signature.", margin + 17, termsY + 19);
    doc.text("• For queries, contact us at support@ecommercestore.com or call 1800-123-4567.", margin + 17, termsY + 23);
    /* ── 7. FOOTER BAND (With side dot matrix patterns) ── */
    const footerY = pageH - 13;
    setFill(bluePrimary);
    doc.rect(0, footerY, pageW, 13, "F");
    // Matrix Dot Grids on Left and Right sides
    setFill([90, 140, 235]); // Cyan-blue dots
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
            doc.circle(8 + c * 2.2, footerY + 3.5 + r * 2.4, 0.45, "F");
            doc.circle(pageW - 18 + c * 2.2, footerY + 3.5 + r * 2.4, 0.45, "F");
        }
    }
    // White Heart Vector Icon in Footer
    const heartX = pageW / 2 - 42;
    const heartY = footerY + 4.5;
    setFill([255, 120, 120]);
    doc.circle(heartX - 0.8, heartY, 0.9, "F");
    doc.circle(heartX + 0.8, heartY, 0.9, "F");
    doc.triangle(heartX - 1.7, heartY + 0.3, heartX + 1.7, heartY + 0.3, heartX, heartY + 2.4, "F");
    setTxt(white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Thank you for shopping with E-Commerce Store!", pageW / 2 + 1, footerY + 5.5, { align: "center" });
    // Globe Vector Icon Outline for Website Line
    setDraw(textLight);
    doc.setLineWidth(0.4);
    const globeX = pageW / 2 - 25;
    const globeY = footerY + 9.5;
    doc.circle(globeX, globeY, 1.2, "S");
    doc.line(globeX - 1.2, globeY, globeX + 1.2, globeY);
    setTxt(textLight);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("www.ecommercestore.com", pageW / 2 + 1, footerY + 10, { align: "center" });
    doc.save(`ECommerceStore_Invoice_${invoiceNo}.pdf`);
    toast.success("Invoice downloaded successfully!");
};
