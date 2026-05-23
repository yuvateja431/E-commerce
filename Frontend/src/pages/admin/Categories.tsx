import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success("Category deleted");
        fetchCategories();
      } catch (error) {
        toast.error("Failed to delete category");
      }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => <div key={n} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500">No categories found. Click 'Add Category' to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: any) => (
            <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat._count?.products || 0} Products</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditClick(cat)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  <FiEdit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">{editId ? "Edit Category" : "Add New Category"}</h3>
              <button onClick={() => { setIsModalOpen(false); setEditId(null); }} className="text-gray-400 hover:text-gray-600 transition">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="e.g. Smartwatches" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Category description (optional)" 
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditId(null); }} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
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
