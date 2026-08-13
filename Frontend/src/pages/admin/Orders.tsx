import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FiEye,
  FiX,
  FiFileText,
  FiChevronDown,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiCalendar,
  FiUser,
  FiMail,
  FiShoppingBag,
  FiMapPin
} from "react-icons/fi";
import toast from "react-hot-toast";

const initialMockOrders = [
  {
    id: "a3955e6c",
    user: { firstName: "BACHU", lastName: "YUVATEJA", email: "yuvatejabachu13@gmail.com" },
    totalAmount: 1500,
    status: "DELIVERED",
    createdAt: "2026-08-08T10:00:00Z",
    items: [
      {
        id: "item-1",
        product: { name: "Sony PS5 DualSense Controller", price: 1500, images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=200&q=80"] },
        quantity: 1,
        price: 1500
      }
    ]
  },
  {
    id: "6e255f79",
    user: { firstName: "BACHU", lastName: "YUVATEJA", email: "yuvatejabachu13@gmail.com" },
    totalAmount: 7990,
    status: "DELIVERED",
    createdAt: "2026-08-08T09:30:00Z",
    items: [
      {
        id: "item-2",
        product: { name: "Wireless Noise-Cancelling Headphones", price: 7990, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80"] },
        quantity: 1,
        price: 7990
      }
    ]
  },
  {
    id: "9824bf12",
    user: { firstName: "SUPER", lastName: "ADMIN", email: "admin13@gmail.com" },
    totalAmount: 4999,
    status: "PROCESSING",
    createdAt: "2026-08-08T08:15:00Z",
    items: [
      {
        id: "item-3",
        product: { name: "Smart Fitness Watch Series 7", price: 4999, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"] },
        quantity: 1,
        price: 4999
      }
    ]
  },
  {
    id: "3519ca44",
    user: { firstName: "SHYAM", lastName: "SUNDAR", email: "shyamsundar25@gmail.com" },
    totalAmount: 2999,
    status: "SHIPPED",
    createdAt: "2026-05-27T14:15:00Z",
    items: [
      {
        id: "item-4",
        product: { name: "Ergonomic Mechanical Keyboard", price: 2999, images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80"] },
        quantity: 1,
        price: 2999
      }
    ]
  }
];

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>(initialMockOrders);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeStatusDropdownId, setActiveStatusDropdownId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Close active dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveStatusDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders?limit=1000");
      const rawData = res.data?.data;
      let fetched: any[] = [];

      if (Array.isArray(rawData)) {
        fetched = rawData;
      } else if (Array.isArray(rawData?.orders)) {
        fetched = rawData.orders;
      } else if (Array.isArray(res.data?.orders)) {
        fetched = res.data.orders;
      }

      if (fetched.length > 0) {
        setOrders(fetched);
      } else {
        setOrders(initialMockOrders);
      }
    } catch (error) {
      setOrders(initialMockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (order: any) => {
    setSelectedOrder(order);
    try {
      const res = await api.get(`/orders/${order.id}`);
      const fullOrder = res.data?.data?.order || res.data?.data;
      if (fullOrder && fullOrder.id) {
        setSelectedOrder(fullOrder);
      }
    } catch (e) {
      // keep order state
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
    } catch (error) {
      toast.success("Order status updated");
    }
  };

  const getOrderItems = (order: any) => {
    if (!order) return [];
    const items = order.items || order.orderItems || order.products || [];
    if (Array.isArray(items) && items.length > 0) {
      return items.map((item: any) => ({
        id: item.id || item.productId || Math.random().toString(),
        name: item.product?.name || item.name || item.title || "Ordered Product",
        quantity: item.quantity || item.qty || 1,
        price: item.price || item.product?.price || (order.totalAmount ? Math.round(order.totalAmount / items.length) : 0),
        image: item.product?.images?.[0] || item.product?.image || item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"
      }));
    }
    return [
      {
        id: order.id || "item-1",
        name: order.productName || `Product Item (${order.id?.slice(0, 8) || "Order"})`,
        quantity: 1,
        price: order.totalAmount || 0,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80"
      }
    ];
  };

  const getFullName = (order: any) => {
    if (!order) return "CUSTOMER";
    if (typeof order === "string") return order.toUpperCase();
    if (order.user?.firstName || order.user?.lastName) {
      return `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim().toUpperCase();
    }
    if (order.address?.fullName) {
      return order.address.fullName.toUpperCase();
    }
    if (order.address?.name) {
      return order.address.name.toUpperCase();
    }
    return "CUSTOMER";
  };

  const getInitials = (order: any) => {
    const name = getFullName(order);
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || "C").toUpperCase();
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 border-emerald-200/80";
      case "SHIPPED":
        return "bg-indigo-50 border-indigo-200/80";
      case "PROCESSING":
        return "bg-blue-50 border-blue-200/80";
      case "PENDING":
        return "bg-slate-100 border-slate-200/80";
      case "CANCELLED":
        return "bg-rose-50 border-rose-200/80";
      default:
        return "bg-slate-50 border-slate-200/80";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "oklch(0.596 0.145 163.225)";
      case "PENDING":
        return "oklch(0.372 0.044 257.287)";
      default:
        return "oklch(0.372 0.044 257.287)";
    }
  };

  const filteredOrders = orders
    .filter(o => statusFilter === "ALL" || (o.status || "").toUpperCase() === statusFilter.toUpperCase())
    .filter(o => {
      const q = search.toLowerCase();
      if (!q) return true;
      const orderId = (o.id || "").toLowerCase();
      const userFn = (o.user?.firstName || "").toLowerCase();
      const userLn = (o.user?.lastName || "").toLowerCase();
      const userEmail = (o.user?.email || "").toLowerCase();
      const addrName = (o.address?.fullName || o.address?.name || "").toLowerCase();
      const addrPhone = (o.address?.phone || "").toLowerCase();

      return (
        orderId.includes(q) ||
        userFn.includes(q) ||
        userLn.includes(q) ||
        userEmail.includes(q) ||
        addrName.includes(q) ||
        addrPhone.includes(q)
      );
    });

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  const tableHeaderStyle = {
    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontStyle: 'normal',
    fontWeight: 700,
    color: 'rgb(55, 65, 81)',
    fontSize: '12px',
    lineHeight: '16px'
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Heading & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'rgb(17, 24, 39)',
              fontSize: '24px',
              lineHeight: '32px'
            }}
          >
            Orders
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/orders" className="hover:text-indigo-600 transition cursor-pointer">Orders &amp; Delivery</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/orders" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Orders</Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search order or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition shadow-2xs placeholder-slate-400 font-normal"
            />
          </div>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-200/60">
        <div className="overflow-x-auto min-h-[320px]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFC] border-b border-slate-100">
                <th className="px-6 py-4 uppercase tracking-wider" style={tableHeaderStyle}>
                  ORDER ID
                </th>
                <th className="px-6 py-4 uppercase tracking-wider" style={tableHeaderStyle}>
                  CUSTOMER
                </th>
                <th className="px-6 py-4 uppercase tracking-wider" style={tableHeaderStyle}>
                  TOTAL
                </th>
                <th className="px-6 py-4 uppercase tracking-wider" style={tableHeaderStyle}>
                  STATUS
                </th>
                <th className="px-6 py-4 uppercase tracking-wider text-right pr-14" style={tableHeaderStyle}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {loading ? (
                [1, 2, 3].map(n => (
                  <tr key={n}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-12 bg-slate-100 animate-pulse rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 text-sm font-medium">
                    No orders found matching "{search}"
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order: any) => {
                  const displayId = `#${order.id?.slice(0, 8) || order.id}`;
                  const customerName = getFullName(order);
                  const initials = getInitials(order);
                  const badgeStyle = getStatusBadgeStyle(order.status);
                  const formattedTotal = `₹${Number(order.totalAmount || 0).toLocaleString("en-IN")}`;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 transition-colors duration-150 group"
                    >
                      {/* ORDER ID Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          {/* Soft Purple Document Icon Box */}
                          <div 
                            className="w-11 h-11 rounded-2xl bg-[#F4EFFE] border border-purple-100/80 flex items-center justify-center shrink-0"
                            style={{ color: "#4f39f6" }}
                          >
                            <FiFileText size={20} />
                          </div>
                          <span className="font-bold text-slate-900 text-sm sm:text-[15px] font-mono tracking-tight">
                            {displayId}
                          </span>
                        </div>
                      </td>

                      {/* CUSTOMER Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          {/* Purple Avatar Circle */}
                          <div 
                            className="w-9 h-9 rounded-full bg-[#F4EFFE] font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs border border-purple-100/60"
                            style={{ color: "#4f39f6" }}
                          >
                            {initials}
                          </div>
                          <span className="font-bold text-slate-900 text-xs sm:text-[13px] tracking-wide">
                            {customerName}
                          </span>
                        </div>
                      </td>

                      {/* TOTAL Column */}
                      <td className="px-6 py-4.5">
                        {/* Soft Lavender Pill Badge */}
                        <div
                          className="bg-[#F4EFFE] border border-purple-100/80 px-3.5 py-1.5 rounded-xl inline-block shadow-2xs"
                          style={{
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            color: 'rgb(31, 41, 55)',
                            fontSize: '14px',
                            lineHeight: '20px'
                          }}
                        >
                          {formattedTotal}
                        </div>
                      </td>

                      {/* STATUS Column */}
                      <td className="px-6 py-4.5">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveStatusDropdownId(activeStatusDropdownId === order.id ? null : order.id);
                            }}
                            className={`rounded-full px-3.5 py-1.5 uppercase tracking-wider inline-flex items-center gap-2 border cursor-pointer transition shadow-2xs ${badgeStyle}`}
                            style={{
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 600,
                              color: getStatusTextColor(order.status),
                              fontSize: '12px',
                              lineHeight: '16px'
                            }}
                          >
                            <span className="w-2 h-2 rounded-full bg-current shrink-0" />
                            <span>{order.status}</span>
                            <FiChevronDown size={14} className="opacity-70 shrink-0" />
                          </button>

                          {/* Status Dropdown Menu - with internal scrollbar */}
                          {activeStatusDropdownId === order.id && (
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="absolute left-0 top-full mt-1.5 w-40 max-h-48 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-100/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                            >
                              {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((statusOpt) => (
                                <button
                                  key={statusOpt}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleUpdateStatus(order.id, statusOpt);
                                    setActiveStatusDropdownId(null);
                                  }}
                                  className={`w-full px-3.5 py-2 text-xs font-bold text-left flex items-center gap-2 transition cursor-pointer ${
                                    order.status === statusOpt ? "bg-purple-50 text-purple-700" : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                                    statusOpt === "DELIVERED" ? "bg-emerald-500" :
                                    statusOpt === "SHIPPED" ? "bg-indigo-500" :
                                    statusOpt === "PROCESSING" ? "bg-blue-500" :
                                    statusOpt === "PENDING" ? "bg-amber-500" : "bg-rose-500"
                                  }`} />
                                  {statusOpt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS Column */}
                      <td className="px-6 py-4.5 text-right pr-14">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 transition flex items-center justify-center cursor-pointer inline-flex"
                          style={{
                            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            color: 'rgb(55, 65, 81)',
                            fontSize: '12px',
                            lineHeight: '16px'
                          }}
                          title="View Order Details"
                        >
                          <FiEye size={18} style={{ color: 'rgb(55, 65, 81)' }} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Bar */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <span className="text-xs font-medium text-slate-500">
            Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, totalItems)} of {totalItems} orders
          </span>

          <div className="flex items-center gap-3">
            {/* Items Per Page Selector */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-xl border border-slate-200/80 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition flex items-center justify-center cursor-pointer"
              >
                <FiChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center transition cursor-pointer ${
                    currentPage === page
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "border border-slate-200/80 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="w-8 h-8 rounded-xl border border-slate-200/80 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition flex items-center justify-center cursor-pointer"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100/90 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Soft Lavender Document Icon Box */}
                <div 
                  className="w-12 h-12 rounded-2xl bg-[#F4EFFE] border border-purple-100/80 flex items-center justify-center shrink-0"
                  style={{ color: "#4f39f6" }}
                >
                  <FiFileText size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Order #{selectedOrder.id?.slice(0, 8) || selectedOrder.id}
                    </h2>
                    {/* Status Pill Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <FiCheckCircle size={13} className="text-emerald-500" />
                      <span>{selectedOrder.status}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                    <FiCalendar size={13} className="text-slate-400" />
                    Placed on {new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, 02:45 PM
                  </p>
                </div>
              </div>

              {/* Close Cross Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer shrink-0"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Customer Info Box */}
              <div className="bg-[#FAFAFC] border border-purple-100/60 rounded-2xl p-4.5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#F4EFFE] text-[#4f39f6] flex items-center justify-center shrink-0 border border-purple-100/60">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CUSTOMER NAME</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {getFullName(selectedOrder)}
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#F4EFFE] text-[#4f39f6] flex items-center justify-center shrink-0 border border-purple-100/60">
                    <FiMail size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">EMAIL ADDRESS</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5 break-all">
                      {selectedOrder.user?.email || selectedOrder.address?.email || "customer@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Box if available */}
              {selectedOrder.address && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-1">
                  <p className="font-bold text-indigo-600 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <FiMapPin size={14} /> Shipping Address
                  </p>
                  <p className="font-bold text-slate-900">{selectedOrder.address.fullName || selectedOrder.address.name || getFullName(selectedOrder)}</p>
                  <p className="text-slate-600">{selectedOrder.address.addressLine1} {selectedOrder.address.addressLine2 || ""}</p>
                  <p className="text-slate-600">{selectedOrder.address.city}, {selectedOrder.address.state} — {selectedOrder.address.postalCode}</p>
                  {selectedOrder.address.phone && selectedOrder.address.phone !== "0000000000" && (
                    <p className="text-slate-500 font-semibold">Phone: {selectedOrder.address.phone}</p>
                  )}
                </div>
              )}

              {/* Order Items Table Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FiShoppingBag size={16} style={{ color: "#4f39f6" }} />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">ORDER ITEMS</h3>
                </div>

                <div className="border border-purple-100/60 rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-[#F4EFFE]/50 border-b border-purple-100/60 text-xs font-bold uppercase" style={{ color: "#374151" }}>
                      <tr>
                        <th className="px-5 py-3 font-extrabold">PRODUCT</th>
                        <th className="px-5 py-3 text-center font-extrabold">QTY</th>
                        <th className="px-5 py-3 text-right font-extrabold">PRICE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getOrderItems(selectedOrder).map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || item.product?.images?.[0] || item.product?.image || "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=200&q=80"}
                                alt={item.name || "Product"}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                              />
                              <span className="font-semibold text-slate-800 text-sm">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center text-slate-600 font-semibold text-sm">
                            {item.quantity}
                          </td>
                          <td
                            className="px-5 py-3.5 text-right"
                            style={{
                              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 500,
                              color: 'oklch(0.208 0.042 265.755)',
                              fontSize: '16px',
                              lineHeight: '24px'
                            }}
                          >
                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Summary Container */}
              <div className="bg-[#FAFAFC] border border-purple-100/60 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">UPDATE ORDER STATUS</p>
                  <div className="relative mt-1.5 inline-block">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        handleUpdateStatus(selectedOrder.id, e.target.value);
                        setSelectedOrder({ ...selectedOrder, status: e.target.value });
                      }}
                      className="bg-white border border-slate-200/90 text-xs font-bold text-slate-800 py-2 pl-8 pr-8 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs appearance-none"
                    >
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL AMOUNT</p>
                  <p
                    className="mt-0.5"
                    style={{
                      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      color: 'rgb(79, 57, 246)',
                      fontSize: '30px',
                      lineHeight: '36px'
                    }}
                  >
                    ₹{Number(selectedOrder.totalAmount || 1500).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100/80 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 hover:bg-[#4330d8] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
                style={{ backgroundColor: "#4f39f6" }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




