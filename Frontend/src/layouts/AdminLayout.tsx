import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiGrid, FiBox, FiLayers, FiShoppingCart, FiUsers,
  FiTag, FiPackage, FiBarChart2, FiSettings, FiLogOut,
  FiChevronDown, FiUser, FiBell, FiSearch, FiMenu, FiChevronLeft, FiChevronRight, FiAward,
  FiAlertTriangle, FiMoon, FiSun, FiHelpCircle, FiTruck, FiRefreshCw, FiMail, FiMessageSquare
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("adminTheme") === "dark" || document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("adminTheme", "light");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("adminTheme") === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Order Received",
      message: "Customer placed a new order in store",
      time: "5 min ago",
      type: "order",
      link: "/admin/orders",
      read: false,
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Products inventory running low (< 5 items)",
      time: "25 min ago",
      type: "inventory",
      link: "/admin/inventory",
      read: false,
    },
    {
      id: 3,
      title: "New Customer Registered",
      message: "A new user signed up for an account",
      time: "1 hour ago",
      type: "user",
      link: "/admin/users",
      read: false,
    },
  ]);

  const menuGroups = [
    {
      title: null,
      items: [
        { name: "Dashboard",  path: "/admin/dashboard",  icon: <FiHome />,       badge: null }
      ]
    },
    {
      title: "USER & VENDOR MANAGEMENT",
      items: [
        { name: "Customers",  path: "/admin/users",      icon: <FiUsers />,      badge: null }
      ]
    },
    {
      title: "PRODUCT & STOCK",
      items: [
        { name: "Products",   path: "/admin/products",   icon: <FiBox />,        badge: null },
        { name: "Categories", path: "/admin/categories", icon: <FiLayers />,     badge: null },
        { name: "Inventory",  path: "/admin/inventory",  icon: <FiPackage />,    badge: null }
      ]
    },
    {
      title: "CONTENT MANAGEMENT",
      items: [
        { name: "FAQs",              path: "/admin/faqs",             icon: <FiHelpCircle />,   badge: null },
        { name: "Shipping Policy",   path: "/admin/shipping-policy",  icon: <FiTruck />,        badge: null },
        { name: "Returns & Refunds", path: "/admin/returns-refunds",  icon: <FiRefreshCw />,    badge: null },
        { name: "Contact Settings",  path: "/admin/contact-us",          icon: <FiMail />,         badge: null },
        { name: "Contact Messages",  path: "/admin/contact-messages", icon: <FiMessageSquare />,badge: null },
      ]
    },
    {
      title: "ORDERS & DELIVERY",
      items: [
        { name: "Orders",     path: "/admin/orders",     icon: <FiShoppingCart />, badge: null },
        { name: "Coupons",    path: "/admin/coupons",    icon: <FiTag />,        badge: null },
        { name: "Analytics",  path: "/admin/analytics",  icon: <FiBarChart2 />,  badge: null },
        { name: "Settings",   path: "/admin/settings",   icon: <FiSettings />,   badge: null }
      ]
    }
  ];

  const menuItems = menuGroups.flatMap(g => g.items);

  const matchingMenuItems = searchQuery.trim()
    ? menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
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
          if (orders.length > 0) {
            const latest = orders[0];
            setNotifications(prev => [
              {
                id: Date.now(),
                title: `Order #${latest.id?.slice(0, 8) || "NEW"}`,
                message: `Amount: ₹${latest.totalAmount || "0"} - Status: ${latest.status || "PENDING"}`,
                time: "Just now",
                type: "order",
                link: "/admin/orders",
                read: false
              },
              ...prev.slice(0, 2)
            ]);
          }
        } else if (Array.isArray(res?.data?.data)) {
          setOrdersCount(res.data.data.length);
        }
      } catch (e) {
        // Handle 403 Forbidden or server error silently
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
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "dark bg-[#131b2e] text-slate-100" : "bg-[#F4F6FC] text-slate-800"}`}>

      {/* ════════════════════════════
          SIDEBAR
      ════════════════════════════ */}
      <aside
        className="relative flex flex-col shrink-0 transition-all duration-300 z-20 bg-white dark:bg-[#1e293b] border-r border-slate-200/80 dark:border-slate-800 shadow-xs"
        style={{
          width: sidebarCollapsed ? 72 : 240,
        }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-slate-100 ${sidebarCollapsed ? "justify-center px-0" : ""}`}>
          <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0 text-white">
            <FiShoppingCart size={18} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-[16px] font-black text-slate-900 leading-tight tracking-tight">
                Store<span className="text-blue-600">Admin</span>
              </p>
              <p
                style={{
                  fontFamily: '"Segoe UI", sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: 'rgb(37, 99, 235)',
                  fontSize: '14px',
                  lineHeight: '20px'
                }}
              >
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3.5 py-4 space-y-4 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {group.title && !sidebarCollapsed && (
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1 text-[#94A3B8]">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path + "/"));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-[#F0F5FF] text-blue-600 font-bold"
                        : "text-slate-700 hover:bg-slate-50 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[17px] shrink-0 transition ${
                          isActive ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && (
                        <span className="text-[13.5px] tracking-tight">{item.name}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && item.badge && (
                      <div className="flex items-center gap-1.5">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                          {item.badge}
                        </span>
                      </div>
                    )}

                    {sidebarCollapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ════════════════════════════
          MAIN CONTENT AREA
      ════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="bg-white dark:bg-[#1e293b] border-b border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] h-[70px] flex items-center px-6 gap-6 shrink-0">

          {/* Hamburger */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
          >
            <FiMenu size={20} />
          </button>



          {/* Search */}
          <div className="flex-1 max-w-sm relative hidden sm:block" ref={searchRef}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              className="w-full pl-11 pr-5 py-2.5 text-sm text-slate-700 bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition duration-200 placeholder-slate-400 font-normal shadow-2xs"
            />

            {/* Live Search Results Dropdown */}
            {searchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden py-2">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                  Sidebar Sections
                </div>

                {matchingMenuItems.length > 0 ? (
                  matchingMenuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setSearchQuery("");
                        setSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50/70 text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-500 group-hover:scale-110 transition text-base">
                          {item.icon}
                        </span>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-700 px-2 py-0.5 rounded-md transition">
                        Go to page &rarr;
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-slate-400 text-center">
                    No matching section found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Night / Dark Mode Moon/Sun Toggle Icon */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition cursor-pointer text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#24304f]"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <FiSun size={20} className="text-slate-200 hover:text-white" /> : <FiMoon size={20} />}
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setNotificationsOpen(prev => !prev);
                setDropdownOpen(false);
              }}
              className={`relative p-2.5 rounded-xl transition ${
                notificationsOpen ? "bg-indigo-50 text-indigo-600" : "hover:bg-slate-100 text-slate-500"
              }`}
              title="Notifications"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#6366F1] rounded-full shadow-sm ring-2 ring-white" />
              )}
            </button>

            {/* Notifications Dropdown Popup */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        setUnreadCount(0);
                      }}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!item.read) {
                            setNotifications(prev =>
                              prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
                            );
                            setUnreadCount(prev => Math.max(0, prev - 1));
                          }
                          setNotificationsOpen(false);
                          if (item.link) navigate(item.link);
                        }}
                        className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer ${
                          !item.read ? "bg-indigo-50/40" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            item.type === "order"
                              ? "bg-indigo-100 text-indigo-600"
                              : item.type === "inventory"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {item.type === "order" && <FiShoppingCart size={15} />}
                          {item.type === "inventory" && <FiAlertTriangle size={15} />}
                          {item.type === "user" && <FiUser size={15} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-bold text-slate-900 truncate ${!item.read ? "font-black" : ""}`}>
                              {item.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                            {item.message}
                          </p>
                        </div>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      navigate("/admin/orders");
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    View All Store Orders &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>

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



