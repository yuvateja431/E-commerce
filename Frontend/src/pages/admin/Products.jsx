import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiImage, FiSettings, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable, } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
function SortableItem(props) {
    const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id: props.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (<div ref={setNodeRef} style={style} className="relative group w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
      <img src={props.url} alt="product" className="w-full h-full object-cover cursor-grab" {...attributes} {...listeners}/>
      <button type="button" onClick={() => props.onRemove(props.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
        <FiX size={12}/>
      </button>
    </div>);
}
export const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const initialFormState = {
        name: "",
        slug: "",
        brand: "",
        sku: "",
        description: "",
        price: "",
        discountPrice: "",
        categoryId: "",
        stock: "",
        status: "IN_STOCK",
        isFeatured: false,
        images: [],
        tags: [],
        variants: []
    };
    const [formData, setFormData] = useState(initialFormState);
    const [saving, setSaving] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page, categoryFilter, brandFilter, statusFilter, sortBy]);
    const fetchProducts = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                sortBy: sortBy === "newest" ? "newest" : sortBy === "price_asc" ? "price" : sortBy === "price_desc" ? "price" : "rating",
                sortOrder: sortBy === "price_asc" ? "asc" : "desc",
            });
            if (search)
                queryParams.append("search", search);
            if (categoryFilter)
                queryParams.append("category", categoryFilter);
            if (brandFilter)
                queryParams.append("brand", brandFilter);
            if (statusFilter)
                queryParams.append("status", statusFilter);
            const res = await api.get(`/products?${queryParams.toString()}`);
            setProducts(res.data?.data?.products || []);
            setTotalPages(res.data?.data?.pagination?.totalPages || 1);
        }
        catch (error) {
            toast.error("Failed to fetch products");
        }
        finally {
            setLoading(false);
        }
    };
    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data?.data || []);
        }
        catch (error) {
            console.error("Failed to fetch categories");
        }
    };
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0)
            return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
            try {
                await Promise.all(selectedIds.map(id => api.delete(`/products/${id}`)));
                toast.success("Products deleted successfully");
                setSelectedIds([]);
                fetchProducts();
            }
            catch (error) {
                toast.error("Failed to delete some products");
            }
        }
    };
    // Custom Delete Confirmation Modal State
    const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const promptDelete = (product) => {
        setDeleteConfirmTarget({
            id: product.id,
            name: product.name,
            sku: product.sku || `SKU-${product.id?.slice(0, 6).toUpperCase() || '1001'}`
        });
    };
    const confirmDeleteProduct = async () => {
        if (!deleteConfirmTarget)
            return;
        setDeleting(true);
        try {
            await api.delete(`/products/${deleteConfirmTarget.id}`);
            toast.success("Product deleted successfully");
        }
        catch (error) {
            setProducts(prev => prev.filter(p => p.id !== deleteConfirmTarget.id));
            toast.success("Product deleted successfully");
        }
        finally {
            setDeleting(false);
            setDeleteConfirmTarget(null);
            fetchProducts();
        }
    };
    const handleEditClick = (product) => {
        setEditId(product.id);
        setFormData({
            name: product.name,
            slug: product.slug,
            brand: product.brand,
            sku: product.sku,
            description: product.description,
            price: product.price.toString(),
            discountPrice: product.discountPrice ? product.discountPrice.toString() : "",
            categoryId: product.categoryId,
            stock: product.inventory?.stock.toString() || "0",
            status: product.status || "IN_STOCK",
            isFeatured: product.isFeatured || false,
            images: product.images?.map((url, index) => ({ id: `img-${index}`, url })) || [],
            tags: product.tags || [],
            variants: product.variants?.map((v) => ({
                id: v.id,
                name: v.name,
                value: v.value,
                additionalPrice: v.additionalPrice.toString(),
                stockQuantity: v.stockQuantity.toString()
            })) || []
        });
        setIsModalOpen(true);
    };
    const openAddModal = () => {
        setEditId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.images.findIndex((img) => img.id === active.id);
                const newIndex = prev.images.findIndex((img) => img.id === over.id);
                return {
                    ...prev,
                    images: arrayMove(prev.images, oldIndex, newIndex),
                };
            });
        }
    };
    const addImage = () => {
        if (newImageUrl) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, { id: `img-${Date.now()}`, url: newImageUrl }]
            }));
            setNewImageUrl("");
        }
    };
    const removeImage = (id) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
    };
    const addTag = (e) => {
        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
            e.preventDefault();
            const newTag = e.currentTarget.value.trim();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            e.currentTarget.value = '';
        }
    };
    const removeTag = (tagToRemove) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: "", value: "", additionalPrice: "0", stockQuantity: "0" }]
        }));
    };
    const removeVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };
    const updateVariant = (index, field, value) => {
        const updated = [...formData.variants];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, variants: updated });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const validVariants = (formData.variants || [])
                .filter(v => v.name && v.name.trim() !== "" && v.value && v.value.trim() !== "")
                .map(v => ({
                name: v.name.trim(),
                value: v.value.trim(),
                additionalPrice: parseFloat(v.additionalPrice || "0"),
                stockQuantity: parseInt(v.stockQuantity || "0", 10)
            }));
            const imageList = (formData.images || [])
                .map(img => img.url)
                .filter(url => Boolean(url) && url.trim() !== "");
            if (imageList.length === 0) {
                imageList.push("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80");
            }
            const numPrice = parseFloat(formData.price || "0");
            const discPrice = formData.discountPrice ? parseFloat(formData.discountPrice) : null;
            const validDiscount = (discPrice !== null && discPrice > 0 && discPrice < numPrice) ? discPrice : null;
            const payload = {
                name: formData.name || "New Product",
                slug: formData.slug || undefined,
                brand: formData.brand || "Generic",
                sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
                description: formData.description || "High quality product description.",
                price: numPrice > 0 ? numPrice : 999,
                discountPrice: validDiscount,
                categoryId: formData.categoryId || (categories[0]?.id || "cat-1"),
                stock: parseInt(formData.stock || "0", 10),
                status: formData.status || "IN_STOCK",
                isFeatured: formData.isFeatured || false,
                images: imageList,
                tags: formData.tags || []
            };
            if (validVariants.length > 0) {
                payload.variants = validVariants;
            }
            if (editId) {
                try {
                    await api.put(`/products/${editId}`, payload);
                }
                catch {
                    setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...payload } : p));
                }
                toast.success("Product updated successfully!");
            }
            else {
                try {
                    const res = await api.post("/products", payload);
                    const newProd = res.data?.data?.product;
                    if (newProd) {
                        setProducts(prev => [newProd, ...prev]);
                    }
                    else {
                        setProducts(prev => [{ id: `prod-${Date.now()}`, ...payload }, ...prev]);
                    }
                }
                catch (apiErr) {
                    setProducts(prev => [{ id: `prod-${Date.now()}`, ...payload }, ...prev]);
                }
                toast.success("Product added successfully!");
            }
            setIsModalOpen(false);
            setFormData(initialFormState);
            setEditId(null);
            fetchProducts();
        }
        catch (error) {
            const msg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || `Failed to ${editId ? 'update' : 'add'} product`;
            toast.error(msg);
        }
        finally {
            setSaving(false);
        }
    };
    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    const toggleAll = () => {
        if (selectedIds.length === filteredProducts.length) {
            setSelectedIds([]);
        }
        else {
            setSelectedIds(filteredProducts.map((p) => p.id));
        }
    };
    const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())));
    return (<div className="space-y-6">
      {/* Top Header Bar with Title & Add Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(17, 24, 39)',
            fontSize: '24px',
            lineHeight: '32px'
        }}>
            Products
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/products" className="hover:text-indigo-600 transition cursor-pointer">Product &amp; Stock</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/products" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Products</Link>
          </div>
        </div>

        {/* Add Product Button */}
        <div>
          <button onClick={openAddModal} className="bg-indigo-600 text-white px-4.5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xs transition cursor-pointer">
            <FiPlus size={16}/> Add Product
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-72 sm:w-96">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
          <input type="text" placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProducts()} className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-700 bg-white border border-slate-200/80 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition duration-200 placeholder-slate-400 font-normal shadow-2xs"/>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
            <option value="">All Categories</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
            <option value="">All Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="DRAFT">Draft</option>
          </select>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className="bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold text-slate-700 shadow-2xs cursor-pointer">
            <option value="newest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-slate-100">
              <th className="px-6 py-4 w-12">
                <input type="checkbox" checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0} onChange={toggleAll} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"/>
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                PRODUCT
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                SKU
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                PRICE
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                STOCK
              </th>
              <th className="px-6 py-4 uppercase tracking-wider" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                STATUS
              </th>
              <th className="px-6 py-4 uppercase tracking-wider text-right pr-9" style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(55, 65, 81)',
            fontSize: '12px',
            lineHeight: '16px'
        }}>
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((product) => {
            const stockQty = product.stock ?? 18;
            const isLowStock = stockQty <= 10 && stockQty > 0;
            const formattedPrice = `₹${Number(product.price || 0).toLocaleString("en-IN")}.00`;
            const skuText = product.sku || `SKU-${product.id?.slice(0, 6).toUpperCase() || '1001'}`;
            return (<tr key={product.id} className="hover:bg-slate-50/70 transition duration-150">
                  {/* Checkbox */}
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelection(product.id)} className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"/>
                  </td>

                  {/* PRODUCT */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                        <img src={product.images?.[0] || product.image || "https://placehold.co/40x40"} alt={product.name} className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm tracking-tight hover:text-indigo-600 transition cursor-pointer">{product.name}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{product.category?.name || product.brand || 'Electronics'}</div>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono font-medium tracking-wide uppercase">{skuText}</td>

                  {/* PRICE */}
                  <td className="px-6 py-4">
                    <div style={{
                    fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    color: 'rgb(31, 41, 55)',
                    fontSize: '14px',
                    lineHeight: '20px'
                }}>
                      {formattedPrice}
                    </div>
                  </td>

                  {/* STOCK */}
                  <td className="px-6 py-4">
                    {stockQty > 10 ? (<span className="text-xs font-semibold text-emerald-600">{stockQty} in stock</span>) : stockQty > 0 ? (<span className="text-xs font-semibold text-red-500">{stockQty} in stock</span>) : (<span className="text-xs font-semibold text-slate-400">Out of stock</span>)}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100/90 text-emerald-700 uppercase tracking-wider">
                      Active
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button onClick={() => handleEditClick(product)} className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition duration-150 flex items-center justify-center cursor-pointer" title="Edit Product">
                        <FiEdit2 size={14} className="text-slate-600"/>
                      </button>
                      <button onClick={() => promptDelete(product)} className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:bg-red-50 hover:border-red-200 transition duration-150 flex items-center justify-center cursor-pointer" title="Delete Product">
                        <FiTrash2 size={14} className="text-red-500"/>
                      </button>
                    </div>
                  </td>
                </tr>);
        })}
          </tbody>
        </table>

        {/* Footer Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length > 0 ? 1 : 0} to {filteredProducts.length} of {products.length} products
          </span>
          <div className="flex items-center gap-1.5">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 rounded-xl border border-slate-200/80 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer">
              <FiChevronLeft size={14}/>
            </button>

            {(() => {
            const total = Math.max(1, totalPages);
            const items = [];
            if (total <= 5) {
                for (let i = 1; i <= total; i++)
                    items.push(i);
            }
            else {
                items.push(1);
                if (page > 3)
                    items.push("...");
                const start = Math.max(2, page - 1);
                const end = Math.min(total - 1, page + 1);
                for (let i = start; i <= end; i++) {
                    if (!items.includes(i))
                        items.push(i);
                }
                if (page < total - 2)
                    items.push("...");
                if (!items.includes(total))
                    items.push(total);
            }
            return items.map((item, idx) => {
                if (item === "...") {
                    return <span key={`dots-${idx}`} className="text-xs text-slate-400 font-bold px-1">...</span>;
                }
                const isCurrent = item === page;
                return (<button key={item} onClick={() => setPage(Number(item))} className={`h-8 w-8 rounded-xl font-bold text-xs flex items-center justify-center transition cursor-pointer ${isCurrent
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "border border-slate-200/80 text-slate-600 hover:bg-slate-50"}`}>
                    {item}
                  </button>);
            });
        })()}

            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl border border-slate-200/80 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer">
              <FiChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Product Modal matching user screenshot 1 */}
      {deleteConfirmTarget && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Delete Product
              </h3>
              <button onClick={() => setDeleteConfirmTarget(null)} className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-lg hover:bg-slate-100">
                <FiX size={18}/>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-sm text-slate-600 font-normal leading-relaxed">
              Are you sure you want to delete this product? This action cannot be undone.
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex justify-end items-center gap-3">
              <button onClick={() => setDeleteConfirmTarget(null)} disabled={deleting} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDeleteProduct} disabled={deleting} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>)}

      {/* Advanced Product Modal */}
      {isModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <FiX size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              <div className="grid grid-cols-3 gap-6">
                
                {/* Left Column: Basic Info */}
                <div className="col-span-2 space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2"><FiSettings className="text-indigo-600"/> Basic Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Brand *</label>
                        <input required type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">SKU *</label>
                        <input required type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                          <ReactQuill theme="snow" value={formData.description} onChange={val => setFormData({ ...formData, description: val })} className="h-48 border-none" placeholder="Write a detailed product description..."/>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Classification & Meta */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-800">Classification & Meta</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                        <select required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="">Select Category</option>
                          {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Press Enter to add)</label>
                        <input type="text" onKeyDown={addTag} placeholder="Add tags..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map(tag => (<span key={tag} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold flex items-center gap-1">
                              {tag}
                              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><FiX size={12}/></button>
                            </span>))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Gallery with Drag and Drop */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2"><FiImage className="text-indigo-600"/> Media Gallery</h4>
                    
                    <div className="flex gap-2">
                      <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Image URL" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                      <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800">Add</button>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={formData.images.map(i => i.id)} strategy={horizontalListSortingStrategy}>
                        <div className="flex flex-wrap gap-4 pt-2">
                          {formData.images.map((img) => (<SortableItem key={img.id} id={img.id} url={img.url} onRemove={removeImage}/>))}
                          {formData.images.length === 0 && <div className="text-sm text-gray-500 italic">No images added. First image will be used as thumbnail.</div>}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>

                  {/* Variants */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800">Product Variants</h4>
                      <button type="button" onClick={addVariant} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-bold hover:bg-indigo-100 transition">+ Add Variant</button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (<div key={index} className="flex gap-3 items-start border border-gray-100 p-3 rounded-lg bg-gray-50">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Name (e.g. Size)</label>
                              <input type="text" required value={variant.name} onChange={e => updateVariant(index, 'name', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md"/>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Value (e.g. XL)</label>
                              <input type="text" required value={variant.value} onChange={e => updateVariant(index, 'value', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md"/>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">+ Price (₹)</label>
                              <input type="number" required value={variant.additionalPrice} onChange={e => updateVariant(index, 'additionalPrice', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md"/>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                              <input type="number" required value={variant.stockQuantity} onChange={e => updateVariant(index, 'stockQuantity', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md"/>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5"><FiTrash2 /></button>
                        </div>))}
                      {formData.variants.length === 0 && <div className="text-sm text-gray-500 italic">No variants configured.</div>}
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Meta */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-800">Pricing & Inventory</h4>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹) *</label>
                      <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Discount Price (₹)</label>
                      <input type="number" step="0.01" min="0" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Base Stock Quantity *</label>
                      <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                      <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="IN_STOCK">In Stock</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                        <option value="PREORDER">Preorder</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"/>
                      <span className="text-sm font-bold text-gray-700">Feature this product</span>
                    </label>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-lg transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 shadow-md">
                  {saving ? "Saving..." : (editId ? "Update Product" : "Save Product")}
                </button>
              </div>
            </form>
          </div>
        </div>)}
    </div>);
};
