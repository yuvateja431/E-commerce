import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiMoreVertical,
  FiChevronRight,
  FiPackage,
  FiSearch
} from "react-icons/fi";
import {
  TbHanger,
  TbShirt,
  TbHeadphones,
  TbDeviceSpeaker,
  TbDeviceLaptop,
  TbDeviceMobile,
  TbShoe,
  TbDeviceWatch,
  TbFridge,
  TbArmchair,
  TbBottle,
  TbDeviceTv,
  TbMouse,
  TbShoppingBag,
  TbDeviceGamepad2,
  TbLayoutGrid
} from "react-icons/tb";
import { PiDress, PiSneaker } from "react-icons/pi";
import toast from "react-hot-toast";

// Helper function to return icon, soft background, and matching text colors
const getCategoryTheme = (name: string) => {
  const n = (name || "").toLowerCase();

  if (n.includes("women") || n.includes("female") || n.includes("dress") || n.includes("girl")) {
    return {
      bg: "bg-purple-50 border-purple-100/70",
      iconColor: "text-purple-500",
      countColor: "text-purple-600",
      icon: PiDress,
    };
  }
  if (n.includes("men") || n.includes("male") || n.includes("shirt") || n.includes("boy")) {
    return {
      bg: "bg-blue-50 border-blue-100/70",
      iconColor: "text-blue-500",
      countColor: "text-blue-600",
      icon: TbShirt,
    };
  }
  if (n.includes("headphone") || n.includes("earphone") || n.includes("headset")) {
    return {
      bg: "bg-emerald-50 border-emerald-100/70",
      iconColor: "text-emerald-500",
      countColor: "text-emerald-600",
      icon: TbHeadphones,
    };
  }
  if (n.includes("audio") || n.includes("speaker") || n.includes("sound")) {
    return {
      bg: "bg-orange-50 border-orange-100/70",
      iconColor: "text-orange-500",
      countColor: "text-orange-600",
      icon: TbDeviceSpeaker,
    };
  }
  if (n.includes("laptop") || n.includes("macbook") || n.includes("notebook")) {
    return {
      bg: "bg-violet-50 border-violet-100/70",
      iconColor: "text-violet-500",
      countColor: "text-violet-600",
      icon: TbDeviceLaptop,
    };
  }
  if (n.includes("smartphone") || n.includes("phone") || n.includes("mobile")) {
    return {
      bg: "bg-sky-50 border-sky-100/70",
      iconColor: "text-sky-500",
      countColor: "text-sky-600",
      icon: TbDeviceMobile,
    };
  }
  if (n.includes("shoe") || n.includes("footwear") || n.includes("sneaker")) {
    return {
      bg: "bg-amber-50 border-amber-100/70",
      iconColor: "text-amber-500",
      countColor: "text-amber-600",
      icon: PiSneaker,
    };
  }
  if (n.includes("watch") || n.includes("clock")) {
    return {
      bg: "bg-pink-50 border-pink-100/70",
      iconColor: "text-pink-500",
      countColor: "text-pink-600",
      icon: TbDeviceWatch,
    };
  }
  if (n.includes("appliance") || n.includes("home") || n.includes("fridge") || n.includes("kitchen")) {
    return {
      bg: "bg-cyan-50 border-cyan-100/70",
      iconColor: "text-cyan-500",
      countColor: "text-cyan-600",
      icon: TbFridge,
    };
  }
  if (n.includes("furniture") || n.includes("chair") || n.includes("sofa") || n.includes("table")) {
    return {
      bg: "bg-emerald-50 border-emerald-100/70",
      iconColor: "text-emerald-500",
      countColor: "text-emerald-600",
      icon: TbArmchair,
    };
  }
  if (n.includes("beauty") || n.includes("cosmetic") || n.includes("makeup") || n.includes("skin")) {
    return {
      bg: "bg-rose-50 border-rose-100/70",
      iconColor: "text-rose-500",
      countColor: "text-rose-600",
      icon: TbBottle,
    };
  }
  if (n.includes("electronic") || n.includes("tv") || n.includes("monitor") || n.includes("display")) {
    return {
      bg: "bg-indigo-50 border-indigo-100/70",
      iconColor: "text-indigo-500",
      countColor: "text-indigo-600",
      icon: TbDeviceTv,
    };
  }
  if (n.includes("computer") || n.includes("mouse") || n.includes("keyboard")) {
    return {
      bg: "bg-lime-50 border-lime-100/70",
      iconColor: "text-lime-600",
      countColor: "text-lime-600",
      icon: TbMouse,
    };
  }
  if (n.includes("fashion") || n.includes("bag") || n.includes("purse")) {
    return {
      bg: "bg-amber-50 border-amber-100/70",
      iconColor: "text-amber-500",
      countColor: "text-amber-600",
      icon: TbShoppingBag,
    };
  }
  if (n.includes("gaming") || n.includes("game") || n.includes("controller")) {
    return {
      bg: "bg-fuchsia-50 border-fuchsia-100/70",
      iconColor: "text-fuchsia-500",
      countColor: "text-fuchsia-600",
      icon: TbDeviceGamepad2,
    };
  }

  // Fallback palette
  const fallbackColors = [
    { bg: "bg-purple-50 border-purple-100/70", iconColor: "text-purple-500", countColor: "text-purple-600", icon: TbLayoutGrid },
    { bg: "bg-blue-50 border-blue-100/70", iconColor: "text-blue-500", countColor: "text-blue-600", icon: TbLayoutGrid },
    { bg: "bg-emerald-50 border-emerald-100/70", iconColor: "text-emerald-500", countColor: "text-emerald-600", icon: TbLayoutGrid },
    { bg: "bg-orange-50 border-orange-100/70", iconColor: "text-orange-500", countColor: "text-orange-600", icon: TbLayoutGrid },
    { bg: "bg-teal-50 border-teal-100/70", iconColor: "text-teal-500", countColor: "text-teal-600", icon: TbLayoutGrid },
    { bg: "bg-pink-50 border-pink-100/70", iconColor: "text-pink-500", countColor: "text-pink-600", icon: TbLayoutGrid },
    { bg: "bg-sky-50 border-sky-100/70", iconColor: "text-sky-500", countColor: "text-sky-600", icon: TbLayoutGrid },
    { bg: "bg-rose-50 border-rose-100/70", iconColor: "text-rose-500", countColor: "text-rose-600", icon: TbLayoutGrid },
  ];

  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbackColors.length;
  return fallbackColors[index];
};

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Options Dropdown Menu active ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Close active menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data?.data || []);
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      toast.success("Category deleted");
    } catch (error) {
      setCategories(prev => prev.filter((c: any) => c.id !== deleteTarget.id));
      toast.success("Category deleted");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
      fetchCategories();
    }
  };

  const handleEditClick = (cat: any) => {
    setEditId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, formData);
        toast.success("Category updated successfully!");
      } else {
        await api.post("/categories", formData);
        toast.success("Category added successfully!");
      }
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
      setEditId(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editId ? 'update' : 'add'} category`);
    } finally {
      setSaving(false);
    }
  };

  // Filter categories by search
  const filteredCategories = categories.filter((cat: any) =>
    (cat.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            Categories
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/products" className="hover:text-indigo-600 transition cursor-pointer">Product &amp; Stock</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/categories" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Categories</Link>
          </div>
        </div>

        {/* Header Action & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition shadow-2xs placeholder-slate-400 font-normal"
            />
          </div>

          <button 
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 transition cursor-pointer shadow-xs shrink-0"
          >
            <FiPlus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="h-24 bg-gray-100 animate-pulse rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-2xs">
          <p className="text-slate-500 text-sm font-medium">
            {searchQuery ? `No categories match "${searchQuery}"` : "No categories found. Click 'Add Category' to create one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredCategories.map((cat: any) => {
            const theme = getCategoryTheme(cat.name);
            const IconComponent = theme.icon;
            const productCount = cat._count?.products ?? 0;

            return (
              <div 
                key={cat.id} 
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 transition-all duration-200 flex items-center justify-between group relative"
              >
                {/* Icon & Details */}
                <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0 pr-2">
                  {/* Soft Tinted Icon Container */}
                  <div className={`w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-2xl flex items-center justify-center shrink-0 border ${theme.bg}`}>
                    <IconComponent className={`text-2xl sm:text-3xl ${theme.iconColor}`} />
                  </div>

                  {/* Category Title & Product Count */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base sm:text-[17px] leading-snug truncate group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <div className={`flex items-center gap-1.5 mt-1 text-xs sm:text-[13px] font-semibold ${theme.countColor}`}>
                      <FiPackage className="text-current text-sm shrink-0" />
                      <span>{productCount} Products</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* 3 Dots Menu Button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === cat.id ? null : cat.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Category Options"
                    >
                      <FiMoreVertical size={18} />
                    </button>

                    {/* Dropdown Popup */}
                    {activeMenuId === cat.id && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            handleEditClick(cat);
                          }}
                          className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <FiEdit2 size={14} className="text-slate-400 group-hover:text-indigo-600" />
                          Edit Category
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeleteTarget({ id: cat.id, name: cat.name });
                          }}
                          className="w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <FiTrash2 size={14} className="text-red-500" />
                          Delete Category
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Chevron Right */}
                  <FiChevronRight className="text-slate-400 text-lg group-hover:translate-x-0.5 group-hover:text-slate-600 transition-all duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Category Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Delete Category
              </h3>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-sm text-slate-600 font-normal leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{deleteTarget.name}</strong>? This action cannot be undone.
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex justify-end items-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{editId ? "Edit Category" : "Add New Category"}</h3>
              <button 
                onClick={() => { setIsModalOpen(false); setEditId(null); }} 
                className="text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-slate-100"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Category Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium transition" 
                  placeholder="e.g. Women's Fashion" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium transition" 
                  placeholder="Category description (optional)" 
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); setEditId(null); }} 
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : (editId ? "Update Category" : "Save Category")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

