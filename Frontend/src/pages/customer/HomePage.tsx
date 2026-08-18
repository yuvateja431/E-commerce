import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import {
  FiArrowRight, FiTruck, FiShield, FiHeadphones,
  FiStar, FiRefreshCw, FiUsers, FiPlayCircle, FiPackage,
  FiZap, FiHeart, FiShoppingCart
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addItem } from "../../store/cartSlice";
import toast from "react-hot-toast";

import heroWatchImg from "../../assets/hero-watch-dome.png";

// Floating bubble positions for the hero (Glass dome scene)
const bubbles = [
  { size: 24, style: { top: "12%", left: "48%", opacity: 0.8 }, delay: 0 },
  { size: 16, style: { top: "70%", left: "46%", opacity: 0.6 }, delay: 0.5 },
  { size: 12, style: { top: "25%", right: "8%", opacity: 0.5 }, delay: 0.2 },
  { size: 40, style: { bottom: "18%", right: "12%", opacity: 0.9 }, delay: 0.7 },
  { size: 18, style: { top: "45%", right: "3%", opacity: 0.4 }, delay: 0.9 },
];

const DEFAULT_CATEGORIES = [
  { id: "cat-electronics", name: "Electronics" },
  { id: "cat-fashion", name: "Fashion & Apparel" },
  { id: "cat-accessories", name: "Accessories" },
  { id: "cat-home", name: "Home & Living" },
  { id: "cat-beauty", name: "Beauty & Care" },
  { id: "cat-sports", name: "Sports & Outdoors" },
];

const goldParticles = [
  { size: 6, top: "15%", left: "12%", right: undefined, delay: 0 },
  { size: 4, top: "65%", left: "8%", right: undefined, delay: 0.7 },
  { size: 8, top: "25%", left: undefined, right: "14%", delay: 0.3 },
  { size: 5, top: "75%", left: undefined, right: "18%", delay: 1.1 },
  { size: 7, top: "45%", left: undefined, right: "6%", delay: 0.5 },
];

export const HomePage = () => {
  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products?limit=8"),
        ]);
        const fetchedCats = catRes.data?.data;
        if (Array.isArray(fetchedCats) && fetchedCats.length > 0) {
          setCategories(fetchedCats.slice(0, 6));
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
        const fetchedProds = prodRes.data?.data?.products || (Array.isArray(prodRes.data?.data) ? prodRes.data?.data : []);
        setFeaturedProducts(fetchedProds);
      } catch (err) {
        console.error("Error fetching homepage data", err);
        setCategories(DEFAULT_CATEGORIES);
      }
    };
    fetchData();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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

  // Calculated 3D Rotation angles based on mouse
  const rotateX = -mousePos.y * 18;
  const rotateY = mousePos.x * 22;
  const shadowX = -mousePos.x * 35;
  const shadowY = mousePos.y * 15 + 30;

  return (
    <div className="overflow-x-hidden bg-[#FAFAFA]">

      {/* ═══════════════════════════════════════════
          LUXURY 3D HERO SECTION (DARK MODE SHOWCASE)
      ═══════════════════════════════════════════ */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden min-h-[700px] flex items-center pt-10 pb-24 bg-[#050505] text-white select-none border-b border-slate-800/40"
      >
        {/* Background Ambient Glows & Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-[#050505] to-[#020202] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-12 min-h-[640px] py-8 lg:py-12">

          {/* ── LEFT: Hero Copy & CTAs ───────────────────────── */}
          <div className="flex-1 z-20 max-w-xl text-center lg:text-left">
            
            {/* "PREMIUM SMARTWATCH" Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-amber-400/5 border border-amber-400/30 text-amber-300 text-[11px] font-extrabold tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.15)]"
            >
              <FiZap size={12} className="text-amber-400 fill-amber-400" />
              <span>PREMIUM SMARTWATCH</span>
            </motion.div>

            {/* Large Luxury Headline */}
            <motion.h1
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-[44px] sm:text-[60px] lg:text-[68px] font-black leading-[1.04] tracking-tight mb-6"
            >
              <span className="text-white block">SMART TECHNOLOGY.</span>
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent block">
                TIMELESS DESIGN.
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-slate-300 text-[15px] sm:text-[17px] leading-relaxed mb-10 max-w-md mx-auto lg:mx-0 font-normal tracking-wide"
            >
              Experience a smarter way to stay connected, active, and in control.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-slate-950 px-8 py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Shop Now</span>
                <FiArrowRight size={17} strokeWidth={2.5} />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 px-8 py-4 rounded-2xl font-bold text-sm backdrop-blur-md transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Collection</span>
              </Link>
            </motion.div>

          </div>

          {/* ── RIGHT: Photorealistic 3D Smartwatch Showcase (Noticeably Increased Image Size) ── */}
          <div className="flex-1 flex justify-center lg:justify-end items-center z-20 w-full">
            <div
              className="relative w-full max-w-[750px]"
              style={{ perspective: 1200 }}
            >

              {/* Dynamic Golden Radial Aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Floating Gold Sparkle Particles */}
              {goldParticles.map((p, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -16, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3.2 + i * 0.7, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
                  className="absolute rounded-full z-30 pointer-events-none bg-gradient-to-r from-amber-300 to-yellow-400 shadow-[0_0_12px_#F59E0B]"
                  style={{
                    width: p.size,
                    height: p.size,
                    top: p.top,
                    left: p.left,
                    right: p.right,
                  }}
                />
              ))}

              {/* Full Watch Image Artwork (Uncropped & Noticeably Larger) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  transition: "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
                }}
                className="relative z-20 group"
              >
                <img
                  src={heroWatchImg}
                  alt="Premium Smartwatch Collection"
                  className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                  style={{
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 100%)",
                    maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 100%)",
                  }}
                />
              </motion.div>

              {/* Dynamic Floor Shadow */}
              <div
                className="w-[500px] h-9 bg-black/90 rounded-full blur-2xl mx-auto -mt-6 pointer-events-none transition-transform duration-150"
                style={{
                  transform: `translate(${shadowX * 0.8}px, ${shadowY * 0.5}px) scaleY(0.4)`,
                }}
              />

            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FLOATING FEATURE STRIP (LIGHT PREVIOUS THEME)
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
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
          CATEGORIES GRID (LIGHT PREVIOUS THEME)
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
                    className="flex flex-col items-center gap-3 py-6 px-3 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] transition text-center group"
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
          TRENDING PRODUCTS (LIGHT PREVIOUS THEME)
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
                  className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] transition-all duration-250 group relative overflow-hidden flex flex-col"
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
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
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
          PROMO BANNER (LIGHT PREVIOUS THEME)
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
                <span>Shop Now</span>
                <FiArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

