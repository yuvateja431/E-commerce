import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from "../../services/cmsService";
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiCheckCircle, FiXCircle, FiLoader, FiX, FiHelpCircle, } from "react-icons/fi";
import toast from "react-hot-toast";
export const AdminFAQsPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [viewFaq, setViewFaq] = useState(null);
    const [deleteFaqId, setDeleteFaqId] = useState(null);
    // Form state
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        displayOrder: 0,
        status: "Active",
    });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    useEffect(() => {
        document.title = "FAQ Management | Admin Panel";
        fetchFaqs();
    }, [statusFilter]);
    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const data = await getFAQs(statusFilter || undefined);
            setFaqs(data);
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to fetch FAQs");
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpenCreateModal = () => {
        setEditingFaq(null);
        setFormData({
            question: "",
            answer: "",
            displayOrder: faqs.length > 0 ? Math.max(...faqs.map((f) => f.displayOrder)) + 1 : 1,
            status: "Active",
        });
        setIsFormModalOpen(true);
    };
    const handleOpenEditModal = (faq) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            displayOrder: faq.displayOrder,
            status: faq.status,
        });
        setIsFormModalOpen(true);
    };
    const handleSaveFaq = async (e) => {
        e.preventDefault();
        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error("Please fill in both question and answer.");
            return;
        }
        try {
            setSaving(true);
            if (editingFaq) {
                const payload = {
                    question: formData.question,
                    answer: formData.answer,
                    displayOrder: Number(formData.displayOrder),
                    status: formData.status,
                };
                await updateFAQ(editingFaq.id, payload);
                toast.success("FAQ updated successfully.");
            }
            else {
                const payload = {
                    question: formData.question,
                    answer: formData.answer,
                    displayOrder: Number(formData.displayOrder),
                    status: formData.status,
                };
                await createFAQ(payload);
                toast.success("FAQ created successfully.");
            }
            setIsFormModalOpen(false);
            fetchFaqs();
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save FAQ");
        }
        finally {
            setSaving(false);
        }
    };
    const handleToggleStatus = async (faq) => {
        try {
            const nextStatus = faq.status === "Active" ? "Inactive" : "Active";
            await updateFAQ(faq.id, { status: nextStatus });
            toast.success(`FAQ set to ${nextStatus}.`);
            fetchFaqs();
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update status");
        }
    };
    const handleDeleteConfirm = async () => {
        if (!deleteFaqId)
            return;
        try {
            setDeleting(true);
            await deleteFAQ(deleteFaqId);
            toast.success("FAQ deleted successfully.");
            setDeleteFaqId(null);
            fetchFaqs();
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to delete FAQ");
        }
        finally {
            setDeleting(false);
        }
    };
    const filteredFaqs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'rgb(17, 24, 39)',
            fontSize: '24px',
            lineHeight: '32px'
        }}>
            FAQs
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/faqs" className="hover:text-indigo-600 transition cursor-pointer">Content Management</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/faqs" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">FAQs</Link>
          </div>
        </div>
        <button onClick={handleOpenCreateModal} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm shadow-blue-500/20">
          <FiPlus size={16}/>
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search FAQs..." className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-800"/>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-700">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

      </div>

      {/* FAQs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (<div className="p-12 text-center text-slate-400 space-y-3">
            <FiLoader className="w-6 h-6 animate-spin mx-auto text-blue-600"/>
            <p className="text-xs font-semibold">Loading FAQs...</p>
          </div>) : filteredFaqs.length === 0 ? (<div className="p-12 text-center text-slate-400 space-y-2">
            <FiHelpCircle className="w-10 h-10 mx-auto text-slate-300"/>
            <p className="text-sm font-bold text-slate-700">No FAQs found</p>
            <p className="text-xs text-slate-500">Create a new FAQ or adjust your search filter.</p>
          </div>) : (<div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Display Order</th>
                  <th className="py-3.5 px-6">Question</th>
                  <th className="py-3.5 px-6">Answer Preview</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredFaqs.map((faq) => (<tr key={faq.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-bold text-slate-900 w-24">
                      #{faq.displayOrder}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 max-w-xs truncate">
                      {faq.question}
                    </td>
                    <td className="py-4 px-6 text-slate-500 max-w-sm truncate">
                      {faq.answer}
                    </td>
                    <td className="py-4 px-6">
                      <button onClick={() => handleToggleStatus(faq)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition cursor-pointer ${faq.status === "Active"
                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`} title="Click to toggle status">
                        {faq.status === "Active" ? (<>
                            <FiCheckCircle size={12}/>
                            <span>Active</span>
                          </>) : (<>
                            <FiXCircle size={12}/>
                            <span>Inactive</span>
                          </>)}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewFaq(faq)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition" title="View FAQ">
                          <FiEye size={16}/>
                        </button>
                        <button onClick={() => handleOpenEditModal(faq)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition" title="Edit FAQ">
                          <FiEdit size={16}/>
                        </button>
                        <button onClick={() => setDeleteFaqId(faq.id)} className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 transition" title="Delete FAQ">
                          <FiTrash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>)}
      </div>

      {/* Create / Edit Modal */}
      {isFormModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900">
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
                <FiX size={18}/>
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  FAQ Question *
                </label>
                <input type="text" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} placeholder="e.g. How do I track my order status?" required className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  FAQ Answer *
                </label>
                <textarea rows={4} value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} placeholder="Provide detailed answer here..." required className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800 resize-y"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input type="number" min={0} value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50">
                  {saving ? <FiLoader className="w-4 h-4 animate-spin"/> : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* View Modal */}
      {viewFaq && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900">FAQ Preview</h3>
              <button onClick={() => setViewFaq(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
                <FiX size={18}/>
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Display Order #{viewFaq.displayOrder}</p>
                <h4 className="text-sm font-extrabold text-slate-900 mt-1">{viewFaq.question}</h4>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-line">
                {viewFaq.answer}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Status: <strong className={viewFaq.status === "Active" ? "text-emerald-600" : "text-slate-400"}>{viewFaq.status}</strong></span>
                <span>Created: {new Date(viewFaq.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>)}

      {/* Custom Delete Confirmation Modal */}
      {deleteFaqId && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <FiTrash2 size={22}/>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete FAQ</h3>
              <p className="text-xs text-slate-500 mt-1">Are you sure you want to delete this FAQ? This action cannot be undone.</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => setDeleteFaqId(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleting} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 disabled:opacity-50">
                {deleting ? <FiLoader className="w-4 h-4 animate-spin"/> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>)}

    </div>);
};
