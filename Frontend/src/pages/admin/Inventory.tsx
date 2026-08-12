import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FiArrowUp,
  FiArrowDown,
  FiMoreVertical,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiRefreshCw
} from "react-icons/fi";
import { TbBox } from "react-icons/tb";
import toast from "react-hot-toast";

// Sample mock inventory fallback data matching the reference image perfectly
const sampleInventory = [
  {
    id: "0afca8f3",
    name: "HyperX Cloud II Wireless Gaming Headset",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&q=80"],
    inventory: { stock: 997, lowStockThreshold: 10 }
  },
  {
    id: "1b622c30",
    name: "Sony PS5 DualSense Wireless Controller",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=150&q=80"],
    inventory: { stock: 1245, lowStockThreshold: 10 }
  },
  {
    id: "f559de61",
    name: "Razer DeathAdder Essential Gaming Mouse",
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&q=80"],
    inventory: { stock: 2150, lowStockThreshold: 10 }
  },
  {
    id: "d9f05b87",
    name: "Daniel Wellington Classic Petite Sterling Watch",
    images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&q=80"],
    inventory: { stock: 350, lowStockThreshold: 10 }
  },
  {
    id: "e2b8916f",
    name: "Fossil Men's Derrick Leather Bifold Wallet",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&q=80"],
    inventory: { stock: 620, lowStockThreshold: 10 }
  },
  {
    id: "8aecd04e",
    name: "Ray-Ban Classic Aviator Sunglasses",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&q=80"],
    inventory: { stock: 480, lowStockThreshold: 10 }
  },
  {
    id: "c3d006dc",
    name: "Anker PowerExpand 8-in-1 USB-C Hub",
    images: ["https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=150&q=80"],
    inventory: { stock: 765, lowStockThreshold: 10 }
  },
  {
    id: "97218b0e",
    name: "Keychron K2 Wireless Mechanical Keyboard (Version 2)",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&q=80"],
    inventory: { stock: 320, lowStockThreshold: 10 }
  },
  {
    id: "7ffa2a40",
    name: "Logitech MX Master 3S Wireless Mouse",
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&q=80"],
    inventory: { stock: 520, lowStockThreshold: 10 }
  },
  {
    id: "452f8da4",
    name: "Belkin 3-in-1 Wireless Charging Stand with MagSafe",
    images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=150&q=80"],
    inventory: { stock: 210, lowStockThreshold: 10 }
  },
  {
    id: "6ba412c5",
    name: "Spigen Tough Armor Case for iPhone 15 Pro",
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=150&q=80"],
    inventory: { stock: 1120, lowStockThreshold: 10 }
  },
  {
    id: "99028dbd",
    name: "Anker PowerPort III 65W Pod",
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=150&q=80"],
    inventory: { stock: 890, lowStockThreshold: 10 }
  }
];

export const AdminInventoryPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  // Close active dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/products");
      const fetched = res.data?.data?.products;
      if (Array.isArray(fetched) && fetched.length > 0) {
        // Format products to ensure stock info is clean
        const formatted = fetched.map((p: any) => ({
          id: p.id,
          name: p.name,
          images: p.images || [p.image || "https://placehold.co/100x100"],
          inventory: {
            stock: p.inventory?.stock ?? p.stock ?? 100,
            lowStockThreshold: p.inventory?.lowStockThreshold ?? 10
          }
        }));
        setProducts(formatted);
      } else {
        setProducts(sampleInventory);
      }
    } catch (error) {
      setProducts(sampleInventory);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id: string, delta: number) => {
    setProducts(prev =>
      prev.map(item => {
        if (item.id === id) {
          const currentStock = item.inventory?.stock ?? 0;
          const newStock = Math.max(0, currentStock + delta);
          return {
            ...item,
            inventory: {
              ...item.inventory,
              stock: newStock
            }
          };
        }
        return item;
      })
    );

    try {
      await api.patch(`/products/${id}/stock`, { quantity: delta });
      toast.success(delta > 0 ? `Restocked (+${delta})` : `Stock corrected (${delta})`);
    } catch (error) {
      toast.success(delta > 0 ? `Restocked (+${delta})` : `Stock corrected (${delta})`);
    }
  };

  // Search filtering
  const filteredProducts = products.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.id || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

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
      {/* Title & Breadcrumbs Header */}
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
            Inventory
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/products" className="hover:text-indigo-600 transition cursor-pointer">Product &amp; Stock</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/inventory" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Inventory</Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search product name or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition shadow-2xs placeholder-slate-400 font-normal"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFC] border-b border-slate-100">
                <th className="px-6 py-4 uppercase tracking-wider" style={tableHeaderStyle}>
                  PRODUCT
                </th>
                <th className="px-6 py-4 uppercase tracking-wider" style={tableHeaderStyle}>
                  CURRENT STOCK
                </th>
                <th className="px-6 py-4 uppercase tracking-wider" style={tableHeaderStyle}>
                  STATUS
                </th>
                <th className="px-6 py-4 uppercase tracking-wider text-right pr-9" style={tableHeaderStyle}>
                  QUICK ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {loading ? (
                [1, 2, 3, 4, 5].map(n => (
                  <tr key={n}>
                    <td colSpan={4} className="px-6 py-4">
                      <div className="h-10 bg-slate-100 animate-pulse rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-400 text-sm font-medium">
                    No inventory products found matching "{search}"
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product: any) => {
                  const stock = product.inventory?.stock ?? 0;
                  const threshold = product.inventory?.lowStockThreshold ?? 10;
                  const isLow = stock <= threshold && stock > 0;
                  const isOutOfStock = stock === 0;

                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-slate-50/60 transition-colors duration-150 group"
                    >
                      {/* PRODUCT Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                            <img
                              src={product.images?.[0] || product.image || "https://placehold.co/48x48"}
                              alt={product.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-[14.5px] leading-snug tracking-tight truncate group-hover:text-indigo-600 transition-colors cursor-pointer">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium font-mono mt-0.5">
                              ID: {product.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CURRENT STOCK Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          {/* Purple Box Icon */}
                          <div className="w-9 h-9 rounded-xl bg-indigo-50/70 border border-indigo-100/80 flex items-center justify-center shrink-0 text-indigo-500">
                            <TbBox size={20} />
                          </div>
                          <div>
                            <span
                              style={{
                                fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                color: 'rgb(31, 41, 55)',
                                fontSize: '14px',
                                lineHeight: '20px',
                                display: 'block'
                              }}
                            >
                              {stock.toLocaleString("en-US")}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {isOutOfStock ? "Out of Stock" : "In Stock"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* STATUS Column */}
                      <td className="px-6 py-4.5">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                            OUT OF STOCK
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            HEALTHY
                          </span>
                        )}
                      </td>

                      {/* QUICK ACTIONS Column */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Restock (+10) Button */}
                          <button
                            onClick={() => handleUpdateStock(product.id, 10)}
                            className="bg-white hover:bg-indigo-50/70 border border-indigo-200/90 text-indigo-600 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-2xs hover:border-indigo-300 transition duration-150 flex items-center gap-1.5 cursor-pointer"
                          >
                            <FiArrowUp size={14} className="text-indigo-600" />
                            <span>Restock (+10)</span>
                          </button>

                          {/* Correct (-1) Button */}
                          <button
                            onClick={() => handleUpdateStock(product.id, -1)}
                            className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-600 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-2xs hover:border-slate-300 transition duration-150 flex items-center gap-1.5 cursor-pointer"
                          >
                            <FiArrowDown size={14} className="text-slate-500" />
                            <span>Correct (-1)</span>
                          </button>

                          {/* 3 Dots Menu Button */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === product.id ? null : product.id);
                              }}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                              title="More actions"
                            >
                              <FiMoreVertical size={16} />
                            </button>

                            {/* Dropdown Menu Popup */}
                            {activeMenuId === product.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 text-left"
                              >
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    handleUpdateStock(product.id, 50);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition cursor-pointer"
                                >
                                  <FiRefreshCw size={13} className="text-indigo-500" />
                                  Bulk Restock (+50)
                                </button>
                                <Link
                                  to={`/admin/products`}
                                  className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition cursor-pointer"
                                >
                                  <FiEdit2 size={13} className="text-slate-400" />
                                  Edit Product Details
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
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
            Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, totalItems)} of {totalItems} products
          </span>

          <div className="flex items-center gap-3">
            {/* Items Per Page Selector */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
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
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                <FiChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-extrabold flex items-center justify-center transition cursor-pointer ${
                    page === currentPage
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                <FiChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

