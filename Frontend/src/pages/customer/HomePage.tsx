import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiArrowRight, FiTruck, FiShield, FiHeadphones,
  FiStar, FiRefreshCw, FiUsers, FiPlayCircle, FiPackage,
  FiZap, FiHeart, FiShoppingCart
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import toast from "react-hot-toast";

// Floating bubble positions for the hero (Glass dome scene)
const bubbles = [
  { size: 24, style: { top: "12%", left: "48%", opacity: 0.8 }, delay: 0 },
  { size: 16, style: { top: "70%", left: "46%", opacity: 0.6 }, delay: 0.5 },
  { size: 12, style: { top: "25%", right: "8%", opacity: 0.5 }, delay: 0.2 },
  { size: 40, style: { bottom: "18%", right: "12%", opacity: 0.9 }, delay: 0.7 },
  { size: 18, style: { top: "45%", right: "3%", opacity: 0.4 }, delay: 0.9 },
];

export const HomePage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/products?limit=8"),
        ]);
        setCategories(catRes.data?.data?.slice(0, 6) || []);
        setFeaturedProducts(prodRes.data?.data?.products || []);
      } catch (err) {
        console.error("Error fetching homepage data", err);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem({ productId: product.id, quantity: 1 }) as any);
    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast("Removed from wishlist"); }
      else { next.add(id); toast.success("Added to wishlist!"); }
      return next;
    });
  };

  const categoryColors = [
    { from: "#6366F1", to: "#818CF8" },
    { from: "#3B82F6", to: "#60A5FA" },
    { from: "#8B5CF6", to: "#A78BFA" },
    { from: "#EC4899", to: "#F472B6" },
    { from: "#F59E0B", to: "#FCD34D" },
    { from: "#10B981", to: "#34D399" },
  ];

  return (
    <div className="overflow-x-hidden bg-[#FAFAFA]">

      {/* ═══════════════════════════════════════════
          HERO SECTION — matches NEW reference exactly
      ═══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden min-h-[640px] flex items-center pt-8 pb-32"
        style={{ background: "linear-gradient(135deg, #F8F8FF 0%, #F0F2FF 50%, #E6EBFF 100%)" }}
      >
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent hidden lg:block pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-10">

          {/* ── LEFT: Hero Copy ───────────────────────── */}
          <div className="flex-1 z-10 max-w-lg mt-8 lg:mt-0">
            {/* "New Collection" badge */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-4 py-1.5 rounded-full mb-7"
            >
              <FiZap size={10} />
              New Collection
            </motion.span>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[52px] lg:text-[68px] font-black leading-[1.05] tracking-tight text-[#0F172A] mb-4"
            >
              Modern Living<br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                Premium Style
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
              className="text-slate-500 text-[16px] leading-relaxed mb-9 max-w-[380px]"
            >
              Discover our curated collection of high-end essentials designed for your contemporary lifestyle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_12px_25px_rgba(99,102,241,0.45)] transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                Shop Collection <FiArrowRight size={15} />
              </Link>
              <button className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 px-7 py-4 rounded-2xl font-bold text-sm shadow-sm transition-all hover:scale-[1.02]">
                <FiPlayCircle size={18} className="text-slate-800" />
                Watch Video
              </button>
            </motion.div>

          </div>

          {/* ── RIGHT: Product Image with Dome ────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
            className="flex-1 flex justify-center lg:justify-end items-center z-10"
          >
            <div className="relative w-[540px] max-w-full">
              
              {/* Animated floating bubbles inside/around dome */}
              {bubbles.map((b, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
                  className="absolute rounded-full z-0"
                  style={{ 
                    width: b.size, height: b.size, 
                    background: "radial-gradient(circle at 30% 30%, #C4B5FD, #7C3AED)", 
                    boxShadow: "inset -2px -2px 6px rgba(0,0,0,0.1)",
                    ...b.style 
                  }}
                />
              ))}

              <img
                src="/assets/hero-watch-dome.png"
                alt="Premium Smartwatch Collection"
                className="relative w-full h-auto object-contain z-10 drop-shadow-[0_20px_40px_rgba(99,102,241,0.2)]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FLOATING FEATURE STRIP
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="bg-white rounded-[32px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100/60 p-6 sm:p-8">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-6 divide-x-0 lg:divide-x divide-slate-100">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <FiTruck size={22} />
              </div>
              <div>
                <p className="text-[13px] font-black text-slate-800 leading-tight">Free Shipping</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">On all orders</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <FiShield size={22} />
              </div>
              <div>
                <p className="text-[13px] font-black text-slate-800 leading-tight">Secure Payment</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">100% protected</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <FiHeadphones size={22} />
              </div>
              <div>
                <p className="text-[13px] font-black text-slate-800 leading-tight">24/7 Support</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Dedicated support</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <FiRefreshCw size={22} />
              </div>
              <div>
                <p className="text-[13px] font-black text-slate-800 leading-tight">Easy Returns</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">30-day return</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex items-center gap-3.5 px-2 lg:px-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50/70 text-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-xl">💎</span>
              </div>
              <div>
                <p className="text-[13px] font-black text-slate-800 leading-tight">Premium Quality</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Top materials</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES GRID
      ═══════════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="py-20" style={{ background: "#FAFAFA" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.18em] mb-1.5">Explore</p>
                <h2 className="text-[30px] font-black text-slate-900 tracking-tight">Shop by Category</h2>
              </div>
              <Link to="/products" className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition">
                View All <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat: any, i: number) => (
                <motion.div key={cat.id} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="flex flex-col items-center gap-3 py-6 px-3 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] transition text-center"
                  >
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md"
                      style={{ background: `linear-gradient(135deg, ${categoryColors[i % 6].from}, ${categoryColors[i % 6].to})` }}
                    >
                      <FiPackage size={22} />
                    </div>
                    <p className="text-[11px] font-black text-slate-700 group-hover:text-indigo-600 transition leading-snug">
                      {cat.name}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TRENDING PRODUCTS
      ═══════════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.18em] mb-1.5">This Week</p>
                <h2 className="text-[30px] font-black text-slate-900 tracking-tight">Trending Products</h2>
              </div>
              <Link to="/products" className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 hover:text-indigo-800 transition">
                View All <FiArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] transition-all duration-250 group relative overflow-hidden"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${product.slug || product.id}`}
                    className="block relative h-52 overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #F0F0FF, #E8ECFF)" }}
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage size={48} className="text-indigo-200" />
                      </div>
                    )}

                    {/* Wishlist button overlay */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className={`absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition shadow-md ${
                        wishlist.has(product.id)
                          ? "bg-rose-500 text-white"
                          : "bg-white/90 text-slate-400 hover:text-rose-500"
                      }`}
                    >
                      <FiHeart size={14} fill={wishlist.has(product.id) ? "currentColor" : "none"} />
                    </button>

                    {/* Category badge */}
                    {product.category?.name && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-indigo-600 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                        {product.category.name}
                      </span>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link
                      to={`/product/${product.slug || product.id}`}
                      className="text-sm font-black text-slate-800 hover:text-indigo-600 transition block line-clamp-1 mb-1.5"
                    >
                      {product.name}
                    </Link>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <FiStar
                          key={j} size={10}
                          className={j < 4 ? "text-amber-400" : "text-slate-200"}
                          fill={j < 4 ? "currentColor" : "none"}
                        />
                      ))}
                      <span className="text-[9px] text-slate-400 font-bold ml-1">(128)</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg font-black text-slate-900">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-xl shadow shadow-indigo-500/20 transition hover:scale-[1.05] active:scale-[0.95]"
                      >
                        <FiShoppingCart size={11} /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          PROMO BANNER
      ═══════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{ background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #6D28D9 100%)" }}
          >
            {/* Deco circles */}
            <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 left-0 w-72 h-72 rounded-full bg-white/5" />

            <div className="relative z-10 text-center md:text-left">
              <span className="inline-block bg-white/15 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                Limited Time Offer
              </span>
              <h3 className="text-3xl font-black text-white leading-tight mb-2">
                Get 20% off on your<br className="hidden md:block" /> First Order
              </h3>
              <p className="text-indigo-200 text-sm font-medium">
                Use code{" "}
                <span className="bg-white/20 text-white font-black px-2 py-0.5 rounded-lg">
                  WELCOME20
                </span>{" "}
                at checkout
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 bg-white hover:bg-indigo-50 text-indigo-700 font-black px-8 py-4 rounded-2xl shadow-xl text-sm transition hover:scale-[1.03]"
              >
                Shop Now <FiArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
