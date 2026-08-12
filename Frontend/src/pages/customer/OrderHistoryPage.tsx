import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutAsync, updateUser } from "../../store/authSlice";
import type { RootState } from "../../store";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiLogOut,
  FiUser,
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiGrid,
  FiDownload,
  FiMail,
  FiShield,
  FiBell
} from "react-icons/fi";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const statusConfig: any = {
  PENDING: { color: "text-yellow-600 bg-yellow-100", icon: <FiClock /> },
  PROCESSING: { color: "text-blue-600 bg-blue-100", icon: <FiPackage /> },
  SHIPPED: { color: "text-indigo-600 bg-indigo-100", icon: <FiTruck /> },
  DELIVERED: { color: "text-green-600 bg-green-100", icon: <FiCheckCircle /> },
  SUCCESS: { color: "text-green-600 bg-green-100", icon: <FiCheckCircle /> },
  PAID: { color: "text-green-600 bg-green-100", icon: <FiCheckCircle /> },
  CANCELLED: { color: "text-red-600 bg-red-100", icon: <FiXCircle /> },
};

export const OrderHistoryPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getInitialTab = (): "profile" | "addresses" | "orders" => {
    const tab = location.state?.tab || searchParams.get("tab");
    if (tab === "orders" || tab === "addresses" || tab === "profile") {
      return tab;
    }
    return "profile";
  };

  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "orders">(getInitialTab);

  useEffect(() => {
    const tab = location.state?.tab || searchParams.get("tab");
    if (tab === "orders" || tab === "addresses" || tab === "profile") {
      setActiveTab(tab);
    }
  }, [location.state, searchParams]);

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Form State
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "HOME",
    isDefault: false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await api.get("/orders/my-orders");
      setOrders(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Addresses
  const fetchAddressesData = async () => {
    setLoadingAddresses(true);
    try {
      const res = await api.get("/addresses/addresses");
      setAddresses(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching addresses", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchAddressesData();
  }, []);

  const handleLogout = () => {
    dispatch(logoutAsync() as any);
    navigate("/");
  };

  // Profile Actions
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      toast.error("First Name and Last Name are required");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await api.patch("/auth/profile", profileForm);
      dispatch(updateUser(res.data?.data || profileForm));
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // Address Actions
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      addressType: "HOME",
      isDefault: addresses.length === 0,
    });
    setIsAddressFormOpen(true);
  };

  const handleOpenEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      addressType: addr.addressType,
      isDefault: addr.isDefault,
    });
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addressForm.fullName.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.addressLine1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.postalCode.trim() ||
      !addressForm.country.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSavingAddress(true);
    try {
      if (editingAddressId) {
        await api.put(`/addresses/addresses/${editingAddressId}`, addressForm);
        toast.success("Address updated successfully");
      } else {
        await api.post("/addresses/addresses", addressForm);
        toast.success("Address added successfully");
      }
      setIsAddressFormOpen(false);
      fetchAddressesData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/addresses/addresses/${id}`);
      toast.success("Address deleted successfully");
      fetchAddressesData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await api.patch(`/addresses/addresses/${id}/default`);
      toast.success("Default address updated");
      fetchAddressesData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to set default address");
    }
  };

  // Client-side invoice downloader — Premium Design
  const handleDownloadInvoice = (order: any) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();   // 210
    const pageH = doc.internal.pageSize.getHeight();  // 297
    const margin = 14;

    /* ── COLORS ─────────────────────────────────────── */
    const ink      = [15,  23,  42];   // slate-900
    const muted    = [100, 116, 139];  // slate-500
    const accent   = [79,  70, 229];   // indigo-600
    const accentLt = [238, 242, 255];  // indigo-50
    const green    = [22, 163,  74];   // green-600
    const white    = [255, 255, 255];
    const border   = [226, 232, 240];  // slate-200

    /* ── HELPERS ─────────────────────────────────────── */
    const setFill  = (c: number[]) => doc.setFillColor(c[0], c[1], c[2]);
    const setTxt   = (c: number[]) => doc.setTextColor(c[0], c[1], c[2]);
    const setDraw  = (c: number[]) => doc.setDrawColor(c[0], c[1], c[2]);

    /* ── 1. FULL-WIDTH HEADER BAND ───────────────────── */
    setFill(accent);
    doc.rect(0, 0, pageW, 42, "F");

    // Brand name
    setTxt(white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("E-COMMERCE", margin, 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text(" STORE", margin + 50, 18);

    // Tagline
    doc.setFontSize(8);
    setTxt([199, 210, 254]); // indigo-200
    doc.text("Premium Online Shopping", margin, 26);

    // TAX INVOICE label (right)
    setTxt(white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TAX INVOICE", pageW - margin, 15, { align: "right" });

    // Invoice number & date (right)
    const invoiceNo = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const invoiceDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    setTxt([199, 210, 254]);
    doc.text(`Invoice No: ${invoiceNo}`, pageW - margin, 25, { align: "right" });
    doc.text(`Date: ${invoiceDate}`, pageW - margin, 32, { align: "right" });

    /* ── 2. INFO SECTION: SOLD BY + BILL TO ─────────── */
    let y = 52;

    // Left panel – Sold by
    setFill(accentLt);
    doc.roundedRect(margin, y, 84, 44, 3, 3, "F");
    setTxt(accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("SOLD BY", margin + 4, y + 8);
    setTxt(ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("E-Commerce Store Pvt. Ltd.", margin + 4, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTxt(muted);
    doc.text("12, Commerce Nagar, MG Road", margin + 4, y + 23);
    doc.text("Bengaluru, Karnataka — 560001", margin + 4, y + 29);
    doc.text("GSTIN: 29AABCU9603R1ZX", margin + 4, y + 35);
    doc.text("support@ecommercestore.com", margin + 4, y + 41);

    // Right panel – Bill to
    const rightX = pageW / 2 + 4;
    setFill([248, 250, 252]);
    setDraw(border);
    doc.roundedRect(rightX, y, 84, 44, 3, 3, "FD");
    setTxt(accent);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("BILL TO / SHIP TO", rightX + 4, y + 8);
    setTxt(ink);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const custName = user?.firstName ? `${user.firstName} ${user.lastName}` : "Customer";
    doc.text(custName, rightX + 4, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    setTxt(muted);

    const addr = order.shippingAddress;
    if (addr) {
      doc.text(addr.street ?? "", rightX + 4, y + 23);
      doc.text(`${addr.city ?? ""}, ${addr.state ?? ""}`, rightX + 4, y + 29);
      doc.text(`${addr.country ?? ""} — ${addr.zipCode ?? ""}`, rightX + 4, y + 35);
    } else {
      doc.text("Address not on record", rightX + 4, y + 23);
    }
    if (user?.email) doc.text(user.email, rightX + 4, y + 41);

    y += 52;

    /* ── 3. ORDER META ROW ───────────────────────────── */
    const metaFields = [
      { label: "Order ID",      value: `#${order.id.slice(0,8).toUpperCase()}` },
      { label: "Payment",       value: order.paymentMethod ?? "COD" },
      { label: "Order Date",    value: invoiceDate },
      { label: "Status",        value: order.paymentStatus || order.status || "PROCESSING" },
    ];
    const cellW = (pageW - margin * 2) / metaFields.length;

    setFill([241, 245, 249]); // slate-100
    doc.rect(margin, y, pageW - margin * 2, 14, "F");

    metaFields.forEach((f, i) => {
      const cx = margin + i * cellW;
      setTxt(muted);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(f.label.toUpperCase(), cx + 4, y + 5);
      setTxt(ink);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(f.value, cx + 4, y + 11);
    });

    y += 20;

    /* ── 4. ITEMS TABLE ──────────────────────────────── */
    const tableItems = (order.items ?? []).map((item: any, idx: number) => {
      const unitPrice = Number(item.price);
      const qty       = item.quantity;
      const taxable   = unitPrice * qty;
      const gstRate   = 0.18;
      const gst       = taxable * gstRate;
      const total     = taxable + gst;
      return [
        String(idx + 1),
        item.product?.name ?? "Product",
        String(qty),
        `₹${unitPrice.toFixed(2)}`,
        `₹${taxable.toFixed(2)}`,
        "18%",
        `₹${gst.toFixed(2)}`,
        `₹${total.toFixed(2)}`,
      ];
    });

    autoTable(doc, {
      startY: y,
      head: [["#", "Description", "Qty", "Unit Price", "Taxable Amt", "GST", "GST Amt", "Total"]],
      body: tableItems,
      styles: {
        fontSize: 8,
        cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
        font: "helvetica",
        textColor: ink as any,
      },
      headStyles: {
        fillColor: accent as any,
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
        3: { halign: "right", cellWidth: 22 },
        4: { halign: "right", cellWidth: 24 },
        5: { halign: "center", cellWidth: 12 },
        6: { halign: "right", cellWidth: 22 },
        7: { halign: "right", cellWidth: 22, fontStyle: "bold" },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] as any },
      tableLineColor: border as any,
      tableLineWidth: 0.1,
      margin: { left: margin, right: margin },
    });

    /* ── 5. TOTALS ───────────────────────────────────── */
    const finalY: number = (doc as any).lastAutoTable?.finalY ?? y + 40;

    const subtotal    = (order.items ?? []).reduce((s: number, i: any) => s + Number(i.price) * i.quantity, 0);
    const totalGST    = subtotal * 0.18;
    const grandTotal  = Number(order.totalAmount ?? subtotal + totalGST);

    const totalsStartX = pageW / 2 + 10;
    const totalsW      = pageW - totalsStartX - margin;
    let ty = finalY + 6;

    const drawTotalRow = (label: string, value: string, bold = false, highlighted = false) => {
      if (highlighted) {
        setFill(accent);
        doc.rect(totalsStartX - 3, ty - 4.5, totalsW + 3, 9, "F");
        setTxt(white);
      } else {
        setTxt(bold ? ink : muted);
      }
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(bold ? 9 : 8.5);
      doc.text(label, totalsStartX, ty);
      doc.text(value, pageW - margin, ty, { align: "right" });
      ty += 8;
    };

    drawTotalRow("Subtotal (excl. GST):", `₹${subtotal.toFixed(2)}`);
    drawTotalRow("CGST (9%):", `₹${(totalGST / 2).toFixed(2)}`);
    drawTotalRow("SGST (9%):", `₹${(totalGST / 2).toFixed(2)}`);
    drawTotalRow("Shipping:", "FREE");
    ty += 2;
    drawTotalRow("GRAND TOTAL:", `₹${grandTotal.toFixed(2)}`, true, true);

    /* ── 6. PAYMENT STATUS STAMP ─────────────────────── */
    const stampY = finalY + 6;
    const stampStatus = (order.paymentStatus || order.status || "").toUpperCase();
    const stampColor  = ["PAID","SUCCESS","PROCESSING","DELIVERED"].includes(stampStatus) ? green : [220, 38, 38];
    setDraw(stampColor);
    doc.setLineWidth(1.2);
    doc.roundedRect(margin, stampY - 2, 44, 14, 2, 2);
    setTxt(stampColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(stampStatus || "CONFIRMED", margin + 22, stampY + 7.5, { align: "center" });
    doc.setLineWidth(0.1);

    /* ── 7. HORIZONTAL RULE ──────────────────────────── */
    const hrY = Math.max(ty, stampY + 22);
    setDraw(border);
    doc.setLineWidth(0.3);
    doc.line(margin, hrY, pageW - margin, hrY);

    /* ── 8. TERMS & FOOTER ───────────────────────────── */
    let noteY = hrY + 7;
    setTxt(muted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text("Terms & Conditions:", margin, noteY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("• All sales are final. Returns accepted within 7 days of delivery.", margin, noteY + 5);
    doc.text("• This is a computer-generated invoice and does not require a physical signature.", margin, noteY + 10);
    doc.text("• For queries, contact us at support@ecommercestore.com or call 1800-123-4567.", margin, noteY + 15);

    /* ── 9. PAGE FOOTER BAND ─────────────────────────── */
    setFill(accent);
    doc.rect(0, pageH - 12, pageW, 12, "F");
    setTxt(white);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("Thank you for shopping with E-Commerce Store! | www.ecommercestore.com", pageW / 2, pageH - 5, { align: "center" });

    doc.save(`ECommerceStore_Invoice_${invoiceNo}.pdf`);
    toast.success("Invoice downloaded!");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Cover Card */}
        <div className="relative bg-gradient-to-r from-[#4F46E5] via-[#5B50E6] to-[#6366F1] rounded-3xl p-6 sm:p-8 shadow-md overflow-hidden mb-8">
          {/* Decorative overlapping background circles */}
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 blur-xs pointer-events-none" />
          <div className="absolute -bottom-24 right-32 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shrink-0">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-indigo-100/90 text-sm font-medium mt-1">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition duration-200 shadow-sm border border-red-50"
              >
                <FiLogOut size={16} className="text-red-500" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Account Panel
            </p>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition duration-200 ${
                activeTab === "profile"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiUser size={18} />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition duration-200 ${
                activeTab === "addresses"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiMapPin size={18} />
              Saved Addresses
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition duration-200 ${
                activeTab === "orders"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FiPackage size={18} />
              My Orders
            </button>

            {/* Secure Account Bottom Card Widget */}
            <div className="pt-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/60 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                  <FiShield size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Secure Account</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-snug mt-0.5">
                    Your account is protected with strong security
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Profile Details */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50/60 rounded-xl text-sm font-bold transition duration-200 shadow-sm"
                      >
                        <FiEdit2 size={14} />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, firstName: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, lastName: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                        >
                          <FiSave size={16} />
                          {savingProfile ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {/* Full Name Card */}
                      <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FiUser size={20} />
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                            FULL NAME
                          </span>
                          <span className="block font-bold text-gray-900 text-sm">
                            {user?.firstName} {user?.lastName}
                          </span>
                        </div>
                      </div>

                      {/* Email Address Card */}
                      <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FiMail size={20} />
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                            EMAIL ADDRESS
                          </span>
                          <span className="block font-bold text-gray-900 text-sm">
                            {user?.email}
                          </span>
                        </div>
                      </div>

                      {/* Account Status Card */}
                      <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <FiCheckCircle size={20} />
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            ACCOUNT STATUS
                          </span>
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* User Role Card */}
                      <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <FiShield size={20} />
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                            USER ROLE
                          </span>
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase">
                            {user?.role || "USER"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 2: Saved Addresses */}
              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                    {!isAddressFormOpen && (
                      <button
                        onClick={handleOpenAddAddress}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition duration-200"
                      >
                        <FiPlus size={16} />
                        Add Address
                      </button>
                    )}
                  </div>

                  {isAddressFormOpen ? (
                    <form onSubmit={handleSaveAddress} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.fullName}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, fullName: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.phone}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="e.g. 9876543210"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.addressLine1}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, addressLine1: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="Flat/House No., Building, Apartment"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            value={addressForm.addressLine2}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, addressLine2: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="Area, Colony, Street, Sector"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Landmark (Optional)
                          </label>
                          <input
                            type="text"
                            value={addressForm.landmark}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, landmark: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="e.g. Near Apollo Hospital"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.city}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, city: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="Mumbai"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.state}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, state: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="Maharashtra"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Postal Code / ZIP *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.postalCode}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, postalCode: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="400001"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Country *
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.country}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, country: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                            placeholder="India"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Address Type
                          </label>
                          <select
                            value={addressForm.addressType}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, addressType: e.target.value })
                            }
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-sm"
                          >
                            <option value="HOME">Home</option>
                            <option value="WORK">Work / Office</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressForm.isDefault}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, isDefault: e.target.checked })
                          }
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="isDefault" className="text-sm font-bold text-gray-600">
                          Set as Default Address
                        </label>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={savingAddress}
                          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                        >
                          <FiSave size={16} />
                          {savingAddress ? "Saving..." : "Save Address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddressFormOpen(false)}
                          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : loadingAddresses ? (
                    <div className="py-8 text-center animate-pulse text-gray-500">
                      Loading addresses...
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50">
                      <FiMapPin className="mx-auto text-gray-300 mb-3" size={40} />
                      <p className="text-gray-500 font-bold text-sm">No saved addresses found.</p>
                      <button
                        onClick={handleOpenAddAddress}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition duration-200"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`p-5 rounded-2xl border transition duration-200 flex flex-col justify-between ${
                            addr.isDefault
                              ? "border-indigo-500 bg-indigo-50/20 shadow-sm shadow-indigo-50"
                              : "border-gray-150 bg-white"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 uppercase">
                                {addr.addressType}
                              </span>
                              {addr.isDefault && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                  Default
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-gray-800 text-sm mb-1">{addr.fullName}</h4>
                            <p className="text-xs text-gray-500 mb-2 font-bold">{addr.phone}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                              {addr.landmark && ` (${addr.landmark})`}
                              <br />
                              {addr.city}, {addr.state} — {addr.postalCode}
                              <br />
                              {addr.country}
                            </p>
                          </div>
                          <div className="flex justify-between items-center border-t border-gray-100/80 mt-4 pt-3">
                            {!addr.isDefault ? (
                              <button
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold"
                              >
                                Set as Default
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400 font-medium">Default Address</span>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenEditAddress(addr)}
                                className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded transition duration-200"
                                title="Edit"
                              >
                                <FiEdit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition duration-200"
                                title="Delete"
                              >
                                <FiTrash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 3: My Orders */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">My Orders</h2>
                    <p className="text-sm text-gray-500">Track and manage your orders</p>
                  </div>

                  {loadingOrders ? (
                    <div className="py-8 text-center animate-pulse text-gray-500">
                      Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-gray-150 rounded-2xl shadow-sm">
                      <FiPackage className="mx-auto text-gray-300 mb-3" size={40} />
                      <p className="text-gray-500 font-bold text-sm">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => {
                        const displayStatus =
                          order.paymentStatus && order.paymentStatus !== "PENDING"
                            ? order.paymentStatus
                            : order.status;
                        const cfg = statusConfig[displayStatus] || statusConfig["PENDING"];
                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                          >
                            <div className="p-6 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                              <div className="flex gap-6 flex-wrap">
                                <div>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                    Order ID
                                  </p>
                                  <p className="font-extrabold text-gray-800 text-sm">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                    Placed Date
                                  </p>
                                  <p className="font-extrabold text-gray-800 text-sm">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric"
                                    })}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                    Total Amount
                                  </p>
                                  <p className="font-extrabold text-indigo-600 text-sm">
                                    ₹{Number(order.totalAmount).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.color}`}
                                >
                                  {cfg.icon}
                                  {displayStatus}
                                </span>
                                <button
                                  onClick={() => handleDownloadInvoice(order)}
                                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold transition duration-200"
                                  title="Download Invoice"
                                >
                                  <FiDownload size={13} />
                                  Invoice
                                </button>
                              </div>
                            </div>

                            <div className="p-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-3">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Order Items
                                  </p>
                                  <div className="divide-y divide-gray-100">
                                    {order.items.map((item: any) => (
                                      <div key={item.id} className="py-2 flex items-center gap-3">
                                        <img
                                          src={item.product?.images?.[0] || "https://placehold.co/100x100"}
                                          alt=""
                                          className="w-10 h-10 rounded-lg object-cover border border-gray-150"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold text-gray-800 truncate">
                                            {item.product?.name || "Product"}
                                          </p>
                                          <p className="text-xs text-gray-500 font-medium">
                                            Qty: {item.quantity} • ₹{Number(item.price).toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    Shipping Details
                                  </p>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    <span className="font-bold text-gray-800">
                                      {user?.firstName} {user?.lastName}
                                    </span>
                                    <br />
                                    {order.shippingAddress?.street}
                                    <br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} —{" "}
                                    {order.shippingAddress?.zipCode}
                                    <br />
                                    {order.shippingAddress?.country}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};




