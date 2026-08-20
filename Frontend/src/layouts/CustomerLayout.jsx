import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiShoppingCart, FiHeart, FiSearch, FiLogOut, FiGrid, FiUser, FiChevronDown, FiMapPin } from "react-icons/fi";
import { logoutAsync } from "../store/authSlice";
import { selectLocation, setLocation } from "../store/slices/locationSlice";
import { LocationModal } from "../components/LocationModal";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
export const CustomerLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { cart } = useSelector((state) => state.cart || { cart: { items: [] } });
    const { wishlist } = useSelector((state) => state.wishlist || { wishlist: { items: [] } });
    const { user } = useSelector((state) => state.auth);
    const location = useSelector(selectLocation);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Auto-sync default user address when user logs in if custom location is not manually overridden
    useEffect(() => {
        if (user && !location.isCustom) {
            api
                .get("/addresses/addresses")
                .then((res) => {
                const addresses = res.data?.data || [];
                const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
                if (defaultAddr) {
                    dispatch(setLocation({
                        city: defaultAddr.city,
                        pincode: defaultAddr.postalCode,
                        stateName: defaultAddr.state,
                        addressLine: defaultAddr.addressLine1,
                        addressId: defaultAddr.id,
                        isCustom: false,
                    }));
                }
            })
                .catch(() => { });
        }
    }, [user]);
    const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const wishlistCount = wishlist?.items?.length || 0;
    const handleLogout = () => {
        dispatch(logoutAsync());
        setIsMenuOpen(false);
        navigate("/");
    };
    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    return (<div className="min-h-screen flex flex-col" style={{ background: "#FAFAFA" }}>
      {/* ─── Header matching the exact requested UI ─── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-4 sm:gap-6">

          {/* ── Logo & Location Container ── */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-sm">
                <FiShoppingCart className="text-white" size={18}/>
              </div>
              <span className="text-[17px] font-black tracking-wide hidden sm:block">
                <span className="text-[#0F172A]">E-COMMERCE </span>
                <span className="text-[#6366F1]">STORE</span>
              </span>
            </Link>

            {/* ── Deliver To Location Widget (Right of logo) ── */}
            <div onClick={() => setIsLocationModalOpen(true)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200 cursor-pointer transition select-none shrink-0 group" title="Click to update delivery location">
              <div className="text-slate-800 group-hover:text-indigo-600 transition shrink-0">
                <FiMapPin size={18} className="stroke-[2.2]"/>
              </div>
              <div className="flex flex-col text-left">
                {user ? (<>
                    <span className="text-[10px] font-semibold text-slate-500 leading-tight">
                      Deliver to {user.firstName ? user.firstName.toLowerCase() : "user"}
                    </span>
                    <span className="text-[12px] font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition">
                      {location.city} {location.pincode}
                    </span>
                  </>) : (<>
                    <span className="text-[11px] font-semibold text-slate-600 leading-tight">
                      Delivering to {location.city || "Hyderabad"} {location.pincode || "500034"}
                    </span>
                    <span className="text-[13px] font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition">
                      Update location
                    </span>
                  </>)}
              </div>
            </div>
          </div>

          {/* ── Search Pill ── */}
          <div className="flex-1 max-w-[500px] mx-4 hidden md:block relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={handleSearch} placeholder="Search for products, brands and more..." className="w-full pl-11 pr-5 py-3 text-[13px] font-medium text-slate-700 bg-[#F5F5FF] border border-transparent rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1]/40 transition placeholder-slate-400"/>
          </div>

          {/* ── Right Section ── */}
          <div className="flex items-center gap-8 shrink-0">
            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link to="/products" className="text-[14px] font-bold text-[#1E293B] hover:text-[#6366F1] transition">
                Shop
              </Link>
              <Link to="/products?tag=deals" className="flex items-center gap-2 text-[14px] font-bold text-[#1E293B] hover:text-[#6366F1] transition">
                Deals
                <span className="text-[10px] font-black bg-[#E0E7FF] text-[#6366F1] px-2 py-0.5 rounded-full leading-none">
                  New
                </span>
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-5">
              {/* Wishlist */}
              <Link to="/wishlist" className="text-[#475569] hover:text-[#6366F1] transition relative">
                <FiHeart size={22} strokeWidth={1.5}/>
                {wishlistCount > 0 && (<span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>)}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="text-[#475569] hover:text-[#6366F1] transition relative">
                <FiShoppingCart size={22} strokeWidth={1.5}/>
                {cartCount > 0 && (<span className="absolute -top-1.5 -right-2 bg-[#6366F1] text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>)}
              </Link>

              {/* Divider */}
              <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"/>

              {/* User Profile */}
              {user ? (<div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-50 transition">
                    <div className="h-9 w-9 bg-gradient-to-br from-[#6366F1] to-violet-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-sm">
                      {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </div>
                    <FiChevronDown size={14} className={`text-slate-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}/>
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (<>
                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}/>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                          <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-100">
                            <p className="font-black text-slate-900 text-sm">{user.firstName} {user.lastName}</p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
                          </div>
                          <div className="p-2 space-y-1">
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm font-semibold">
                              <FiUser size={16}/>
                              <span>My Account</span>
                            </Link>
                            <Link to="/profile?tab=orders" state={{ tab: "orders" }} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm font-semibold">
                              <FiShoppingCart size={16}/>
                              <span>My Orders</span>
                            </Link>
                            {(user.role === "ADMIN" || user.role === "MANAGER") && (<Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm font-semibold">
                                <FiGrid size={16}/>
                                <span>Admin Panel</span>
                              </Link>)}
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition text-sm font-semibold">
                              <FiLogOut size={16}/>
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </>)}
                  </AnimatePresence>
                </div>) : (<Link to="/login" className="px-5 py-2.5 bg-[#6366F1] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm">
                  Login
                </Link>)}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ─── Premium Footer (Restored) ─── */}
      <footer className="bg-[#0F172A] text-white pt-16 pb-8 mt-auto border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 bg-[#6366F1] rounded-xl flex items-center justify-center">
                <FiShoppingCart className="text-white" size={18}/>
              </div>
              <span className="text-[15px] font-black tracking-wide">
                <span className="text-white">E-COMMERCE </span>
                <span className="text-[#818CF8]">STORE</span>
              </span>
            </div>
            <p className="text-slate-400 text-[13px] leading-relaxed">
              Premium quality products curated for your modern, contemporary lifestyle. Designed with excellence.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-[13px] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-slate-400 text-[13px] font-medium">
              <li><Link to="/products" className="hover:text-indigo-400 transition">All Products</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition">My Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-400 transition">Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-[13px] uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-slate-400 text-[13px] font-medium">
              <li><Link to="/faq" className="hover:text-indigo-400 transition">FAQ</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-indigo-400 transition">Shipping Policy</Link></li>
              <li><Link to="/returns-refunds" className="hover:text-indigo-400 transition">Returns & Refunds</Link></li>
              <li><Link to="/contact-us" className="hover:text-indigo-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-[13px] uppercase tracking-wider">Newsletter</h4>
            <p className="text-slate-400 text-[13px] mb-5">Get exclusive deals & new arrivals straight to your inbox.</p>
            <div className="flex rounded-xl overflow-hidden border border-slate-700 focus-within:border-indigo-500 transition shadow-inner">
              <input type="email" placeholder="Enter your email" className="bg-[#1E293B] border-none px-4 py-3 w-full text-[13px] text-white focus:ring-0 focus:outline-none placeholder-slate-500"/>
              <button className="bg-[#6366F1] hover:bg-indigo-600 px-5 py-3 text-[13px] font-bold text-white shrink-0 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[12px] font-medium">
          <p>© 2026 E-Commerce Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* ── Location Picker Modal ── */}
      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)}/>
    </div>);
};
