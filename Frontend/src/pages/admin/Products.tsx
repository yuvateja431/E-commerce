import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiImage, FiSettings } from "react-icons/fi";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem(props: { id: string; url: string; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
      <img src={props.url} alt="product" className="w-full h-full object-cover cursor-grab" {...attributes} {...listeners} />
      <button 
        type="button"
        onClick={() => props.onRemove(props.id)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <FiX size={12} />
      </button>
    </div>
  );
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
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
    images: [] as { id: string; url: string }[],
    tags: [] as string[],
    variants: [] as { id?: string; name: string; value: string; additionalPrice: string; stockQuantity: string }[]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      if (search) queryParams.append("search", search);
      if (categoryFilter) queryParams.append("category", categoryFilter);
      if (brandFilter) queryParams.append("brand", brandFilter);
      if (statusFilter) queryParams.append("status", statusFilter);

      const res = await api.get(`/products?${queryParams.toString()}`);
      setProducts(res.data?.data?.products || []);
      setTotalPages(res.data?.data?.pagination?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      try {
        await Promise.all(selectedIds.map(id => api.delete(`/products/${id}`)));
        toast.success("Products deleted successfully");
        setSelectedIds([]);
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete some products");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEditClick = (product: any) => {
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
      images: product.images?.map((url: string, index: number) => ({ id: `img-${index}`, url })) || [],
      tags: product.tags || [],
      variants: product.variants?.map((v: any) => ({
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

  const handleDragEnd = (event: any) => {
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

  const removeImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { name: "", value: "", additionalPrice: "0", stockQuantity: "0" }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || undefined,
        brand: formData.brand,
        sku: formData.sku,
        description: formData.description,
        price: parseFloat(formData.price || "0"),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        categoryId: formData.categoryId,
        stock: parseInt(formData.stock || "0", 10),
        status: formData.status,
        isFeatured: formData.isFeatured,
        images: formData.images.map(img => img.url),
        tags: formData.tags,
        variants: formData.variants.map(v => ({
          name: v.name,
          value: v.value,
          additionalPrice: parseFloat(v.additionalPrice || "0"),
          stockQuantity: parseInt(v.stockQuantity || "0", 10)
        }))
      };
      
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        toast.success("Product updated successfully!");
      } else {
        await api.post("/products", payload);
        toast.success("Product added successfully!");
      }
      
      setIsModalOpen(false);
      setFormData(initialFormState);
      setEditId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editId ? 'update' : 'add'} product`);
    } finally {
      setSaving(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p: any) => p.id));
    }
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select value={categoryFilter} onChange={e => {setCategoryFilter(e.target.value); setPage(1);}} className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            <option value="">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setPage(1);}} className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            <option value="">All Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="DRAFT">Draft</option>
          </select>
          <select value={sortBy} onChange={e => {setSortBy(e.target.value); setPage(1);}} className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
            <option value="newest">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-100 transition"
            >
              <FiTrash2 /> Delete Selected ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 w-10">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={toggleAll}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.map((product: any) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(product.id)}
                    onChange={() => toggleSelection(product.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.images?.[0] || "https://placehold.co/40x40"} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.brand} | {product.category?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm font-mono">{product.sku}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">${product.price.toFixed(2)}</div>
                  {product.discountPrice && (
                    <div className="text-xs text-green-600 font-medium">Sale: ${product.discountPrice.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.status === 'IN_STOCK' ? 'bg-green-100 text-green-700' : 
                    product.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Advanced Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Product" : "Add New Product"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <FiX size={24} />
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
                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Brand *</label>
                        <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">SKU *</label>
                        <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description *</label>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                          <ReactQuill 
                            theme="snow" 
                            value={formData.description} 
                            onChange={val => setFormData({...formData, description: val})} 
                            className="h-48 border-none"
                            placeholder="Write a detailed product description..."
                          />
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
                        <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="">Select Category</option>
                          {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Press Enter to add)</label>
                        <input 
                          type="text" 
                          onKeyDown={addTag}
                          placeholder="Add tags..." 
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold flex items-center gap-1">
                              {tag}
                              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><FiX size={12}/></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Gallery with Drag and Drop */}
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2"><FiImage className="text-indigo-600"/> Media Gallery</h4>
                    
                    <div className="flex gap-2">
                      <input 
                        type="url" 
                        value={newImageUrl} 
                        onChange={e => setNewImageUrl(e.target.value)} 
                        placeholder="Image URL" 
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                      <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800">Add</button>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={formData.images.map(i => i.id)} strategy={horizontalListSortingStrategy}>
                        <div className="flex flex-wrap gap-4 pt-2">
                          {formData.images.map((img) => (
                            <SortableItem key={img.id} id={img.id} url={img.url} onRemove={removeImage} />
                          ))}
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
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="flex gap-3 items-start border border-gray-100 p-3 rounded-lg bg-gray-50">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Name (e.g. Size)</label>
                              <input type="text" required value={variant.name} onChange={e => updateVariant(index, 'name', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Value (e.g. XL)</label>
                              <input type="text" required value={variant.value} onChange={e => updateVariant(index, 'value', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">+ Price (₹)</label>
                              <input type="number" required value={variant.additionalPrice} onChange={e => updateVariant(index, 'additionalPrice', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                              <input type="number" required value={variant.stockQuantity} onChange={e => updateVariant(index, 'stockQuantity', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md" />
                            </div>
                          </div>
                          <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5"><FiTrash2 /></button>
                        </div>
                      ))}
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
                      <input required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Discount Price (₹)</label>
                      <input type="number" step="0.01" min="0" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Base Stock Quantity *</label>
                      <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                      <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="IN_STOCK">In Stock</option>
                        <option value="OUT_OF_STOCK">Out of Stock</option>
                        <option value="PREORDER">Preorder</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
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
        </div>
      )}
    </div>
  );
};
