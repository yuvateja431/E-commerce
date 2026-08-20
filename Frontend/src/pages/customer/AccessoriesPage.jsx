import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FiSearch, FiX, FiShoppingCart, FiHeart, FiEye, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { toggleWishlist } from "../../store/wishlistSlice";
import toast from "react-hot-toast";
export const AccessoriesPage = () => {
    const dispatch = useDispatch();
    const { wishlist } = useSelector((state) => state.wishlist || { wishlist: { items: [] } });
    // State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    // Quick View Modal State
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState({});
    // Predefined accessories categories
    const accessoryCategoryNames = [
        "Mobile Accessories",
        "Computer Accessories",
        "Fashion Accessories",
        "Gaming Accessories"
    ];
    // Fetch categories and products on mount
    useEffect(() => {
        const initPage = async () => {
            setLoading(true);
            try {
                // Fetch all categories
                const catRes = await api.get("/categories");
                const allCats = catRes.data?.data || [];
                // Filter to only accessory categories
                const filteredCats = allCats.filter((cat) => accessoryCategoryNames.includes(cat.name));
                setCategories(filteredCats);
                // Fetch products
                await fetchProducts(filteredCats, "All", sortBy);
            }
            catch (error) {
                toast.error("Failed to load page data");
            }
            finally {
                setLoading(false);
            }
        };
        initPage();
    }, []);
    // Fetch products with optional category ID filter
    const fetchProducts = async (catsList, categoryFilter, sorting) => {
        setLoading(true);
        try {
            let categoryIds = "";
            if (categoryFilter === "All") {
                // Fetch products for all accessory categories
                categoryIds = catsList.map(c => c.id).join(",");
            }
            else {
                const found = catsList.find(c => c.name === categoryFilter);
                if (found)
                    categoryIds = found.id;
            }
            if (!categoryIds && catsList.length > 0) {
                categoryIds = catsList.map(c => c.id).join(",");
            }
            const res = await api.get("/products", {
                params: {
                    category: categoryIds || undefined,
                    sortBy: sorting === "popularity" ? "popularity" : sorting === "rating" ? "rating" : sorting === "price" ? "price" : sorting === "price-desc" ? "price-desc" : "newest",
                    sortOrder: sorting === "price" ? "asc" : sorting === "price-desc" ? "desc" : "desc",
                    excludeDraft: "true",
                    limit: "100" // Fetch large subset for local premium search filtering
                }
            });
            setProducts(res.data?.data?.products || []);
        }
        catch (error) {
            setProducts([]);
        }
        finally {
            setLoading(false);
        }
    };
    // Trigger product fetch when category filter or sort changes
    const handleCategoryChange = (catName) => {
        setSelectedCategory(catName);
        fetchProducts(categories, catName, sortBy);
    };
    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        fetchProducts(categories, selectedCategory, newSort);
    };
    // Add to cart helper
    const handleAddToCart = (e, product) => {
        e.preventDefault();
        dispatch(addItem({ productId: product.id, quantity: 1 }));
        toast.success(`${product.name} added to cart`);
    };
    // Toggle wishlist helper
    const handleToggleWishlist = (e, productId) => {
        e.preventDefault();
        dispatch(toggleWishlist(productId));
    };
    // Check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlist?.items?.some((item) => item.productId === productId);
    };
    // Dynamic client-side search filtering
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<div className="min-h-screen bg-[#fafafa] font-sans antialiased pb-24">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1c29] via-[#24273a] to-[#1e2030] text-white py-16 px-4 mb-12 shadow-md">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-4">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-full border border-indigo-500/30">
              Premium Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Tech & Fashion Accessories
            </h1>
            <p className="text-gray-400 max-w-xl text-sm md:text-base font-light">
              Elevate your daily setup and style with our curated high-performance gear, premium smart peripherals, and luxury lifestyle accessories.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="text-center border-r border-white/10 pr-6">
              <span className="block text-3xl font-black text-indigo-400">100%</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Genuine Products</span>
            </div>
            <div className="text-center pl-2">
              <span className="block text-3xl font-black text-emerald-400">FREE</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Delivery Across India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Controls Bar: Categories, Search, and Sort */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex flex-col lg:flex-row gap-6 justify-between items-center">

          {/* Glassmorphic Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button onClick={() => handleCategoryChange("All")} className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition ${selectedCategory === "All"
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
            : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
              All Accessories
            </button>
            {accessoryCategoryNames.map((catName) => (<button key={catName} onClick={() => handleCategoryChange(catName)} className={`px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition ${selectedCategory === catName
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
                {catName.split(" ")[0]}
              </button>))}
          </div>

          {/* Search & Sort Wrapper */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input type="text" placeholder="Search accessories by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition"/>
              {searchQuery && (<button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
                  <FiX size={14}/>
                </button>)}
            </div>

            {/* Sort Dropdown */}
            <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-gray-700 font-bold tracking-wide">
              <option value="newest">Sort: Latest</option>
              <option value="popularity">Sort: Best Selling</option>
              <option value="price">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="rating">Sort: Top Rated</option>
            </select>
          </div>
        </div>

        {/* Dynamic Items Counter */}
        <div className="mb-6 flex justify-between items-center px-2">
          <p className="text-sm text-gray-500">
            Found <span className="font-extrabold text-gray-900">{filteredProducts.length}</span> luxury accessories
          </p>
        </div>

        {/* Grid / Skeletons / Empty States */}
        {loading ? (
        /* Skeleton Loader Shimmer */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (<div key={i} className="h-[380px] bg-white border border-gray-100 rounded-3xl p-4 flex flex-col space-y-4 animate-pulse">
                <div className="w-full h-52 bg-gray-100 rounded-2xl"/>
                <div className="h-4 bg-gray-100 rounded w-1/3"/>
                <div className="h-6 bg-gray-100 rounded w-3/4"/>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-gray-100 rounded w-1/4"/>
                  <div className="h-10 w-10 bg-gray-100 rounded-xl"/>
                </div>
              </div>))}
          </div>) : filteredProducts.length === 0 ? (
        /* Elegant Empty State Card */
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiSearch size={32} className="text-indigo-500"/>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No Accessories Found</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 px-4">
              We couldn't find any accessories matching your filters. Try clearing your search query or selecting a different category tab.
            </p>
            <button onClick={() => {
                setSearchQuery("");
                handleCategoryChange("All");
            }} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-600/10">
              Reset Filters
            </button>
          </div>) : (
        /* Professional Products Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
                const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
                const isWishlisted = isInWishlist(product.id);
                return (<motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }} transition={{ duration: 0.3 }} className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {hasDiscount && (<span className="bg-red-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        Sale -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </span>)}
                    {product.averageRating >= 4.8 && (<span className="bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <FiStar className="fill-current"/> Top Rated
                      </span>)}
                  </div>

                  {/* Wishlist Button */}
                  <button onClick={(e) => handleToggleWishlist(e, product.id)} className={`absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-sm transition-all duration-300 ${isWishlisted
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500 hover:bg-white"}`}>
                    <FiHeart size={16} fill={isWishlisted ? "currentColor" : "none"}/>
                  </button>

                  {/* Product Image Panel */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img src={product.images?.[0] || "https://placehold.co/400x400/png?text=No+Image"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                    {/* Hover Overlay Actions */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-2">
                      <button onClick={() => {
                        setQuickViewProduct(product);
                        setActiveImageIndex(0);
                    }} className="bg-white text-gray-900 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 hover:bg-gray-100 transition transform translate-y-4 group-hover:translate-y-0 duration-300">
                        <FiEye size={14}/> Quick View
                      </button>
                    </div>
                  </div>

                  {/* Product Metadata Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1.5 block">
                      {product.brand} • {product.category?.name}
                    </span>
                    <Link to={`/product/${product.id}`} className="font-extrabold text-gray-900 hover:text-indigo-600 transition text-sm mb-2 line-clamp-2 block">
                      {product.name}
                    </Link>

                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="flex text-yellow-400">
                        <FiStar className="fill-current" size={12}/>
                      </div>
                      <span className="text-xs font-bold text-gray-900">{product.averageRating?.toFixed(1) || "4.5"}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] text-gray-500 font-medium">({product.reviewCount || 24} reviews)</span>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                      <div>
                        {hasDiscount ? (<div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-indigo-600">₹{product.discountPrice}</span>
                            <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                          </div>) : (<span className="text-lg font-black text-gray-900">₹{product.price}</span>)}
                      </div>
                      <button onClick={(e) => handleAddToCart(e, product)} className="bg-indigo-600 text-white p-2.5 rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20" title="Add to Cart">
                        <FiShoppingCart size={16}/>
                      </button>
                    </div>
                  </div>
                </motion.div>);
            })}
          </div>)}
      </div>

      {/* Premium Quick View Drawer/Modal */}
      <AnimatePresence>
        {quickViewProduct && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]">
              {/* Close Button */}
              <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-full transition">
                <FiX size={18}/>
              </button>

              {/* Left Column: Images Carousel */}
              <div className="md:w-1/2 p-6 flex flex-col bg-gray-50/50 justify-center">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm mb-4 flex items-center justify-center">
                  <img src={quickViewProduct.images?.[activeImageIndex] || "https://placehold.co/400x400/png?text=No+Image"} alt={quickViewProduct.name} className="w-full h-full object-cover"/>
                </div>
                {/* Thumbnails list */}
                {quickViewProduct.images && quickViewProduct.images.length > 1 && (<div className="flex gap-2.5 overflow-x-auto py-1">
                    {quickViewProduct.images.map((imgUrl, idx) => (<button key={idx} onClick={() => setActiveImageIndex(idx)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${idx === activeImageIndex ? "border-indigo-600 scale-95" : "border-gray-200"}`}>
                        <img src={imgUrl} alt="" className="w-full h-full object-cover"/>
                      </button>))}
                  </div>)}
              </div>

              {/* Right Column: Details & Checkout Options */}
              <div className="md:w-1/2 p-8 overflow-y-auto max-h-[80vh] md:max-h-none flex flex-col">
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-widest mb-2 block">
                  {quickViewProduct.brand}
                </span>
                <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                  {quickViewProduct.name}
                </h3>

                {/* Rating summary */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    <FiStar className="fill-current" size={14}/>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{quickViewProduct.averageRating?.toFixed(1) || "4.7"}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500 font-semibold">{quickViewProduct.reviewCount || 24} ratings</span>
                  <span className="text-gray-300">•</span>
                  <span className={`text-xs font-bold ${quickViewProduct.status === 'OUT_OF_STOCK' ? 'text-red-500' : 'text-emerald-600'}`}>
                    {quickViewProduct.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'In Stock'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light" dangerouslySetInnerHTML={{ __html: quickViewProduct.description }}/>

                {/* Price Display */}
                <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Price</span>
                  <div className="flex items-baseline gap-3">
                    {quickViewProduct.discountPrice ? (<>
                        <span className="text-3xl font-black text-indigo-600">₹{quickViewProduct.discountPrice}</span>
                        <span className="text-sm text-gray-400 line-through font-semibold">₹{quickViewProduct.price}</span>
                      </>) : (<span className="text-3xl font-black text-gray-900">₹{quickViewProduct.price}</span>)}
                  </div>
                </div>

                {/* Variants Selection (if configured) */}
                {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (<div className="mb-6 space-y-3">
                    <span className="text-xs text-gray-700 font-extrabold uppercase tracking-wider">Configure Options:</span>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.variants.map((variant) => (<button key={variant.id} onClick={() => setSelectedVariant(prev => ({ ...prev, [variant.name]: variant.value }))} className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${selectedVariant[variant.name] === variant.value
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                          {variant.name}: {variant.value} {variant.additionalPrice > 0 ? `(+₹${variant.additionalPrice})` : ""}
                        </button>))}
                    </div>
                  </div>)}

                {/* SKU & Tags */}
                <div className="space-y-1.5 text-xs text-gray-500 mb-8 border-t border-gray-100 pt-6 mt-auto">
                  <div>SKU: <span className="font-mono text-gray-700 font-bold">{quickViewProduct.sku}</span></div>
                  {quickViewProduct.tags && quickViewProduct.tags.length > 0 && (<div className="flex flex-wrap gap-1.5 pt-1.5">
                      {quickViewProduct.tags.map((tag) => (<span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          #{tag}
                        </span>))}
                    </div>)}
                </div>

                {/* Add to Cart Actions */}
                <div className="flex gap-4">
                  <button onClick={(e) => {
                handleAddToCart(e, quickViewProduct);
                setQuickViewProduct(null);
            }} disabled={quickViewProduct.status === 'OUT_OF_STOCK'} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm py-4 rounded-2xl transition shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 disabled:opacity-50">
                    <FiShoppingCart /> Add To Shopping Cart
                  </button>
                  <button onClick={(e) => handleToggleWishlist(e, quickViewProduct.id)} className={`p-4 border rounded-2xl transition ${isInWishlist(quickViewProduct.id)
                ? "border-red-500 bg-red-50 text-red-500"
                : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-900"}`}>
                    <FiHeart fill={isInWishlist(quickViewProduct.id) ? "currentColor" : "none"}/>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>)}
      </AnimatePresence>
    </div>);
};
