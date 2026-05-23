import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid, FiBox, FiLayers, FiShoppingCart, FiUsers,
  FiTag, FiPackage, FiBarChart2, FiSettings, FiLogOut,
  FiChevronDown, FiUser, FiBell, FiSearch, FiMenu, FiChevronLeft, FiAward
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { logoutAsync } from "../store/authSlice";
import type { RootState } from "../store";

export const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth?.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { name: "Dashboard",  path: "/admin/dashboard",  icon: <FiGrid />,       badge: null },
    { name: "Products",   path: "/admin/products",   icon: <FiBox />,        badge: null },
    { name: "Categories", path: "/admin/categories", icon: <FiLayers />,     badge: null },
    { name: "Orders",     path: "/admin/orders",     icon: <FiShoppingCart />, badge: ordersCount },
    { name: "Customers",  path: "/admin/users",      icon: <FiUsers />,      badge: null },
    { name: "Coupons",    path: "/admin/coupons",    icon: <FiTag />,        badge: null },
    { name: "Inventory",  path: "/admin/inventory",  icon: <FiPackage />,    badge: null },
    { name: "Analytics",  path: "/admin/analytics",  icon: <FiBarChart2 />,  badge: null },
    { name: "Settings",   path: "/admin/settings",   icon: <FiSettings />,   badge: null },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // Fetch orders count for badge
    const fetchCount = async () => {
      try {
        const res = await api.get("/orders"); // Admin getAll returns object with orders array
        const orders = res?.data?.data?.orders;
        if (Array.isArray(orders)) {
          setOrdersCount(orders.length);
        } else if (Array.isArray(res?.data?.data)) {
          // Fallback for unexpected shape
          setOrdersCount(res.data.data.length);
        }
      } catch (e) {
        console.error("Failed to fetch orders count", e);
      }
    };
    fetchCount();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logoutAsync() as any);
    navigate("/login");
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "SA"
    : "SA";

  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Super Admin";
  const currentPageName = menuItems.find(item => location.pathname.startsWith(item.path))?.name || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F4F6FC" }}>

      {/* ════════════════════════════
          SIDEBAR
      ════════════════════════════ */}
      <aside
        className="relative flex flex-col shrink-0 transition-all duration-300 z-20"
        style={{
          width: sidebarCollapsed ? 72 : 230,
          background: "linear-gradient(180deg, #1D1654 0%, #16113F 100%)",
        }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-6 ${sidebarCollapsed ? "justify-center px-0" : ""}`}>
          <div className="h-10 w-10 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40 shrink-0">
            <FiShoppingCart className="text-white" size={18} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-[14px] font-black text-white leading-tight">Store Admin</p>
              <p className="text-[10px] font-semibold text-indigo-400 leading-tight">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                title={sidebarCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-[#6366F1] text-white shadow-lg shadow-indigo-900/30"
                    : "text-indigo-300 hover:bg-white/8 hover:text-white"
                }`}
                style={isActive ? {} : {}}
              >
                <span className={`text-[18px] shrink-0 ${isActive ? "text-white" : "text-indigo-400 group-hover:text-white"}`}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <>
                    <span className="text-[13px] font-semibold flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="bg-[#6366F1] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-indigo-800/50 min-w-[22px] text-center leading-4">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#6366F1] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade to Pro Card */}
        {!sidebarCollapsed && (
          <div className="mx-3 mb-4 p-4 rounded-2xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)" }}>
            <div className="absolute top-[-20px] right-[-20px] w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <FiAward className="text-white" size={18} />
              </div>
              <p className="text-[13px] font-black text-white">Upgrade to Pro</p>
              <p className="text-[11px] text-indigo-200 mt-1 leading-tight">Unlock all features and get unlimited access.</p>
              <button className="mt-3 w-full py-2 bg-white text-indigo-700 text-[11px] font-black rounded-xl hover:bg-indigo-50 transition">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3.5 top-20 h-7 w-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 transition z-30"
        >
          <FiChevronLeft
            size={14}
            className={`text-slate-500 transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </aside>

      {/* ════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-[70px] flex items-center px-6 gap-6 shrink-0">

          {/* Hamburger */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
          >
            <FiMenu size={20} />
          </button>

          {/* Page Title */}
          <h1 className="text-[20px] font-black text-[#0F172A] tracking-tight">{currentPageName}</h1>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-4 relative hidden lg:block">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2.5 text-[13px] text-slate-600 bg-slate-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition placeholder-slate-400"
            />
          </div>

          <div className="flex-1" />

          {/* Notification Bell */}
          <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition">
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#6366F1] rounded-full shadow-sm" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-slate-50 transition"
            >
              {/* Avatar */}
              <div className="h-9 w-9 bg-gradient-to-br from-[#6366F1] to-violet-500 rounded-full flex items-center justify-center font-black text-sm text-white shadow shadow-indigo-500/20">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[13px] font-black text-[#0F172A] leading-tight">{fullName}</p>
                <p className="text-[10px] text-slate-400 font-semibold leading-tight">
                  {user?.role === "ADMIN" ? "Administrator" : user?.role ?? "Administrator"}
                </p>
              </div>
              <FiChevronDown
                className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                size={15}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-slate-50 bg-gradient-to-r from-indigo-50 to-violet-50">
                  <p className="text-[13px] font-black text-slate-900 truncate">{fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email ?? ""}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <FiUser size={15} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/admin/settings"); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-semibold text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <FiSettings size={15} />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-semibold text-rose-500 rounded-xl hover:bg-rose-50 transition"
                  >
                    <FiLogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
