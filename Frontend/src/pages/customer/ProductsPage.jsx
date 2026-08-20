import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FiFilter, FiSearch, FiX, FiCheck } from "react-icons/fi";
import { ProductCard } from "../../components/ProductCard";
import { useDebounce } from "../../hooks/useDebounce";
export const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    // State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    // Search state
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const debouncedSearch = useDebounce(searchInput, 400);
    // URL Params
    const categoryParam = searchParams.get("category") || "";
    const brandParam = searchParams.get("brand") || "";
    const selectedCategories = categoryParam ? categoryParam.split(",") : [];
    const selectedBrands = brandParam ? brandParam.split(",") : [];
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const rating = searchParams.get("rating") || "";
    const inStock = searchParams.get("inStock") === "true";
    const onSale = searchParams.get("onSale") === "true";
    const sortBy = searchParams.get("sortBy") || "newest";
    // Predefined brands for demo multi-select
    const predefinedBrands = ["Apple", "Samsung", "Sony", "Nike", "Adidas", "LG"];
    // Fetch Categories
    useEffect(() => {
        api.get("/categories").then(res => {
            const fetched = res.data?.data;
            if (Array.isArray(fetched) && fetched.length > 0) {
                setCategories(fetched);
            }
            else {
                setCategories([
                    { id: "cat-electronics", name: "Electronics" },
                    { id: "cat-fashion", name: "Fashion & Apparel" },
                    { id: "cat-accessories", name: "Accessories" },
                    { id: "cat-home", name: "Home & Living" },
                    { id: "cat-beauty", name: "Beauty & Care" },
                    { id: "cat-sports", name: "Sports & Outdoors" },
                ]);
            }
        }).catch(() => { });
    }, []);
    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = Object.fromEntries(searchParams.entries());
                const res = await api.get("/products", {
                    params: { ...params, excludeDraft: "true" }
                });
                setProducts(res.data?.data?.products || []);
                setPagination(res.data?.data?.pagination || { page: 1, totalPages: 1, total: 0 });
            }
            catch (error) {
                setProducts([]);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]);
    // Fetch Suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearch.length >= 2) {
                try {
                    const res = await api.get(`/products/suggestions?q=${encodeURIComponent(debouncedSearch)}`);
                    setSuggestions(res.data?.data || []);
                    setShowSuggestions(true);
                }
                catch {
                    setSuggestions([]);
                }
            }
            else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };
        fetchSuggestions();
    }, [debouncedSearch]);
    // Handle outside click for suggestions
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // Filter change handlers
    const updateParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                newParams.delete(key);
            }
            else {
                newParams.set(key, value);
            }
        });
        // Reset page if we are changing filters (not pagination itself)
        if (!updates.page) {
            newParams.set("page", "1");
        }
        setSearchParams(newParams);
    };
    const handleSearchSubmit = (e) => {
        if (e.key === "Enter") {
            setShowSuggestions(false);
            updateParams({ search: searchInput });
        }
    };
    const toggleArrayParam = (paramName, currentValues, value) => {
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        updateParams({ [paramName]: newValues.length ? newValues.join(",") : null });
    };
    const clearFilters = () => {
        setSearchInput("");
        setSearchParams(new URLSearchParams());
    };
    return (<div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Bar: Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        
        {/* Debounced Search */}
        <div className="relative w-full md:w-1/2 lg:w-1/3 z-50" ref={searchRef}>
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="text" placeholder="Search products, brands, categories..." value={searchInput} onChange={(e) => {
            setSearchInput(e.target.value);
            if (e.target.value === "")
                updateParams({ search: null });
        }} onKeyDown={handleSearchSubmit} onFocus={() => { if (suggestions.length)
        setShowSuggestions(true); }} className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"/>
          {searchInput && (<button onClick={() => { setSearchInput(""); updateParams({ search: null }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX />
            </button>)}

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              {suggestions.map((item) => (<Link key={item.id} to={`/product/${item.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                  <img src={item.images?.[0] || "https://placehold.co/100x100"} alt={item.name} className="w-12 h-12 rounded object-cover"/>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="text-indigo-600 font-medium">{item.category?.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 font-bold">${item.discountPrice ?? item.price}</span>
                    </div>
                  </div>
                </Link>))}
            </div>)}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 md:hidden font-medium text-gray-700 bg-white">
            <FiFilter /> Filters
          </button>
          
          <select value={sortBy} onChange={(e) => updateParams({ sortBy: e.target.value })} className="flex-1 md:flex-none px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700 font-medium shadow-sm">
            <option value="popularity">Popularity (Best Sellers)</option>
            <option value="newest">Latest Products</option>
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Largest Discount</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 space-y-8 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-full"><FiX /></button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Filters</h3>
              {(searchParams.toString() !== "") && (<button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear All</button>)}
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Categories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {categories.map((cat) => (<label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${selectedCategories.includes(cat.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                      {selectedCategories.includes(cat.id) && <FiCheck size={14}/>}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat.id)} onChange={() => toggleArrayParam("category", selectedCategories, cat.id)}/>
                    <span className={`text-sm ${selectedCategories.includes(cat.id) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {cat.name}
                    </span>
                  </label>))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Brands</h4>
              <div className="space-y-2">
                {predefinedBrands.map(b => (<label key={b} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${selectedBrands.includes(b) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                      {selectedBrands.includes(b) && <FiCheck size={14}/>}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedBrands.includes(b)} onChange={() => toggleArrayParam("brand", selectedBrands, b)}/>
                    <span className={`text-sm ${selectedBrands.includes(b) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{b}</span>
                  </label>))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Price Range</h4>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParams({ minPrice: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParams({ maxPrice: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
              </div>
            </div>

            {/* Availability & Offers */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Availability</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${inStock ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${inStock ? 'left-5.5 translate-x-5' : 'left-0.5'}`}/>
                  </div>
                  <input type="checkbox" className="hidden" checked={inStock} onChange={(e) => updateParams({ inStock: e.target.checked ? "true" : null })}/>
                  <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${onSale ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${onSale ? 'left-5.5 translate-x-5' : 'left-0.5'}`}/>
                  </div>
                  <input type="checkbox" className="hidden" checked={onSale} onChange={(e) => updateParams({ onSale: e.target.checked ? "true" : null })}/>
                  <span className="text-sm font-medium text-gray-700">On Sale / Discounted</span>
                </label>
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(r => (<label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" checked={rating === r.toString()} onChange={() => updateParams({ rating: r.toString() })} className="text-indigo-600 focus:ring-indigo-500 border-gray-300"/>
                    <span className="flex text-yellow-400 text-sm">
                      {"★".repeat(r)}{"☆".repeat(5 - r)}
                    </span>
                    <span className="text-xs text-gray-500">& Up</span>
                  </label>))}
              </div>
            </div>

          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
            <span>Showing <span className="font-bold text-gray-900">{products.length}</span> of <span className="font-bold text-gray-900">{pagination.total}</span> products</span>
          </div>

          {loading ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (<div key={i} className="h-[380px] bg-white border border-gray-100 rounded-2xl animate-pulse p-4 flex flex-col">
                  <div className="w-full h-48 bg-gray-100 rounded-xl mb-4"/>
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"/>
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-4"/>
                  <div className="h-6 bg-gray-100 rounded w-1/4 mt-auto"/>
                </div>))}
            </div>) : products.length === 0 ? (<div className="text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch size={32} className="text-gray-300"/>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">We couldn't find anything matching your current filters. Try removing some filters or searching for something else.</p>
              <button onClick={clearFilters} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm">
                Clear All Filters
              </button>
            </div>) : (<>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (<ProductCard key={product.id} product={product}/>))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (<div className="mt-16 flex justify-center gap-2">
                  <button disabled={pagination.page === 1} onClick={() => updateParams({ page: (pagination.page - 1).toString() })} className="px-4 py-2 rounded-xl font-medium border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white">
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (<button key={p} onClick={() => updateParams({ page: p.toString() })} className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold transition shadow-sm ${pagination.page === p ? "bg-indigo-600 text-white border-transparent" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {p}
                    </button>))}

                  <button disabled={pagination.page === pagination.totalPages} onClick={() => updateParams({ page: (pagination.page + 1).toString() })} className="px-4 py-2 rounded-xl font-medium border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-white">
                    Next
                  </button>
                </div>)}
            </>)}
        </div>
      </div>
    </div>);
};
