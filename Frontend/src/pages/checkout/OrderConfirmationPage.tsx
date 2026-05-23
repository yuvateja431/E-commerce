import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import { selectCheckout, reset } from "../../store/slices/checkoutSlice";
import { fetchOrder } from "../../services/checkoutService";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiMapPin, FiDownload, FiShoppingBag, FiList } from "react-icons/fi";
import { motion } from "framer-motion";

export default function OrderConfirmationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { confirmedOrder, orderId } = useSelector(selectCheckout);

  useEffect(() => {
    if (!confirmedOrder && orderId) {
      fetchOrder(orderId)
        .then((res) => {
          dispatch({ type: "checkout/setConfirmedOrder", payload: res.data || res });
        })
        .catch(() => toast.error("Failed to load order details"));
    }
  }, [orderId, confirmedOrder, dispatch]);

  if (!orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <FiPackage size={56} className="mx-auto text-gray-300 mb-4" />
        <p className="text-xl text-gray-500 font-medium">No order information available.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const order = confirmedOrder?.data || confirmedOrder;

  const handleDownloadInvoice = () => {
    if (!order) {
      toast.error("Order data not loaded yet");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // ── Header ──────────────────────────────────────────────────
    doc.setFillColor(67, 56, 202); // indigo-700
    doc.rect(0, 0, pageWidth, 36, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("E-Commerce Store", 14, 16);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("TAX INVOICE", 14, 27);

    // Invoice number & date (right-aligned)
    doc.setFontSize(9);
    const invoiceDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    doc.text(`Invoice Date: ${invoiceDate}`, pageWidth - 14, 16, { align: "right" });
    doc.text(`Order ID: #${(order.id ?? orderId ?? "").slice(0, 8).toUpperCase()}`, pageWidth - 14, 27, { align: "right" });

    // ── Bill To / Ship To ────────────────────────────────────────
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To / Ship To:", 14, 48);
    doc.setFont("helvetica", "normal");

    let addrY = 55;
    const addr = order.address;
    if (addr) {
      const lines = [
        addr.fullName ?? "",
        addr.addressLine1 ?? "",
        addr.addressLine2 ? addr.addressLine2 : null,
        `${addr.city ?? ""}, ${addr.state ?? ""} — ${addr.postalCode ?? ""}`,
        addr.country ?? "",
      ].filter(Boolean) as string[];
      lines.forEach((line) => {
        doc.text(line, 14, addrY);
        addrY += 6;
      });
    } else {
      doc.text("Address not available", 14, addrY);
      addrY += 6;
    }

    // Payment status badge
    const payStatus = order.paymentStatus || order.status || "—";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(22, 163, 74); // green
    const badgeText = `  ${payStatus}  `;
    const badgeW = doc.getTextWidth(badgeText) + 4;
    doc.roundedRect(pageWidth - 14 - badgeW, 44, badgeW, 8, 2, 2, "F");
    doc.text(badgeText, pageWidth - 14 - badgeW + 2, 50);

    doc.setTextColor(30, 30, 30);

    // ── Items Table ──────────────────────────────────────────────
    const tableStartY = Math.max(addrY + 8, 80);
    const items = (order.items ?? []).map((item: any, idx: number) => [
      idx + 1,
      item.product?.name ?? "Product",
      item.quantity,
      `Rs. ${Number(item.price).toFixed(2)}`,
      `Rs. ${(Number(item.price) * item.quantity).toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [["#", "Item", "Qty", "Unit Price", "Total"]],
      body: items,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: {
        fillColor: [67, 56, 202],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 },
        2: { halign: "center", cellWidth: 18 },
        3: { halign: "right", cellWidth: 35 },
        4: { halign: "right", cellWidth: 35 },
      },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      margin: { left: 14, right: 14 },
    });

    // ── Totals ───────────────────────────────────────────────────
    const finalY: number = (doc as any).lastAutoTable?.finalY ?? tableStartY + 30;
    const shipping = Number(order.shippingAmount ?? 0);
    const subtotal = (order.items ?? []).reduce(
      (acc: number, item: any) => acc + Number(item.price) * item.quantity,
      0
    );
    const grandTotal = Number(order.totalAmount ?? subtotal + shipping);

    const totalsX = pageWidth - 60;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Subtotal:", totalsX, finalY + 12);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, pageWidth - 14, finalY + 12, { align: "right" });
    doc.text("Shipping:", totalsX, finalY + 20);
    doc.text(shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`, pageWidth - 14, finalY + 20, { align: "right" });

    // Grand total bar
    doc.setFillColor(67, 56, 202);
    doc.rect(totalsX - 4, finalY + 24, pageWidth - totalsX, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Grand Total:", totalsX, finalY + 32);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, pageWidth - 16, finalY + 32, { align: "right" });

    // ── Footer ───────────────────────────────────────────────────
    const footerY = doc.internal.pageSize.getHeight() - 14;
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Thank you for shopping with E-Commerce Store!", pageWidth / 2, footerY, { align: "center" });
    doc.text("This is a computer-generated invoice and does not require a signature.", pageWidth / 2, footerY + 5, { align: "center" });

    doc.save(`Invoice_${(order.id ?? orderId ?? "order").slice(0, 8).toUpperCase()}.pdf`);
    toast.success("Invoice downloaded!");
  };

  const handleViewOrders = () => {
    dispatch(reset());
    navigate("/profile");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-100">
          <FiCheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500">Thank you for your purchase. Your order is being processed.</p>
      </motion.div>

      {/* Order Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6"
      >
        {/* Order Meta */}
        <div className="bg-gray-50 px-8 py-5 grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
            <p className="font-bold text-gray-900 text-sm">#{order?.id?.slice(0, 8) ?? orderId?.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Payment</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              (order?.paymentStatus === "PAID" || order?.status === "SUCCESS")
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {order?.paymentStatus || order?.status || "—"}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
            <p className="font-bold text-indigo-600">₹{order?.totalAmount?.toFixed(2) ?? "—"}</p>
          </div>
        </div>

        {/* Shipping Address */}
        {order?.address && (
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-indigo-500" size={16} />
              <h3 className="font-bold text-gray-900">Shipping To</h3>
            </div>
            <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-800">{order.address.fullName}</p>
              <p>{order.address.addressLine1}{order.address.addressLine2 && `, ${order.address.addressLine2}`}</p>
              <p>{order.address.city}, {order.address.state} — {order.address.postalCode}</p>
              {order.address.country && <p>{order.address.country}</p>}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 mb-4">
            <FiPackage className="text-indigo-500" size={16} />
            <h3 className="font-bold text-gray-900">Items</h3>
          </div>
          {order?.items?.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {order.items.map((item: any) => (
                <li key={item.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{item.product?.name ?? "Product"}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">No item details available.</p>
          )}

          {/* Order Total */}
          <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">Shipping</span>
            <span className="font-bold text-sm text-gray-900">
              {order?.shippingAmount === 0 ? "Free" : `₹${order?.shippingAmount?.toFixed(2) ?? "0.00"}`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-3"
      >
        <button
          onClick={handleViewOrders}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm shadow-indigo-200"
        >
          <FiList size={16} />
          View Order History
        </button>
        <button
          onClick={handleDownloadInvoice}
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
        >
          <FiDownload size={16} />
          Download Invoice
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
        >
          <FiShoppingBag size={16} />
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
}
