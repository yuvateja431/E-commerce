import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getContentPage, upsertContentPage } from "../../services/cmsService";
import { FiSave, FiLoader, FiGlobe, FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
export const AdminReturnsRefundsPage = () => {
    const [formData, setFormData] = useState({
        pageTitle: "Returns & Refunds Policy",
        shortDescription: "",
        content: "",
        status: "Active",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    useEffect(() => {
        document.title = "Returns & Refunds | Admin Panel";
        fetchPageContent();
    }, []);
    const fetchPageContent = async () => {
        try {
            setLoading(true);
            const data = await getContentPage("returns-refunds");
            if (data) {
                setFormData({
                    pageTitle: data.pageTitle || "Returns & Refunds Policy",
                    shortDescription: data.shortDescription || "",
                    content: data.content || "",
                    status: data.status || "Active",
                });
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load Returns & Refunds policy");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.pageTitle.trim() || !formData.content.trim()) {
            toast.error("Page Title and Content are required.");
            return;
        }
        try {
            setSaving(true);
            await upsertContentPage("returns-refunds", formData);
            toast.success("Returns & Refunds policy updated successfully.");
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update Returns & Refunds policy");
        }
        finally {
            setSaving(false);
        }
    };
    return (<div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
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
            Returns & Refunds
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/returns-refunds" className="hover:text-indigo-600 transition cursor-pointer">Content Management</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/returns-refunds" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Returns & Refunds</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setShowPreview(!showPreview)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2">
            <FiEye size={16}/>
            <span>{showPreview ? "Edit Mode" : "Preview Page"}</span>
          </button>
          <a href="/returns-refunds" target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2">
            <FiGlobe size={16}/>
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {loading ? (<div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
          <FiLoader className="w-6 h-6 animate-spin mx-auto text-blue-600"/>
          <p className="text-xs font-semibold text-slate-500">Loading Returns & Refunds Policy content...</p>
        </div>) : showPreview ? (
        /* Preview Mode */
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          <div className="pb-6 border-b border-slate-100">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600">
              Live Preview
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">{formData.pageTitle}</h2>
            {formData.shortDescription && (<p className="text-slate-500 text-xs mt-1">{formData.shortDescription}</p>)}
          </div>
          <div className="prose prose-slate max-w-none text-xs" dangerouslySetInnerHTML={{ __html: formData.content }}/>
        </div>) : (
        /* Form Editor Mode */
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Page Title *
              </label>
              <input type="text" value={formData.pageTitle} onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })} placeholder="e.g. Returns & Refunds Policy" required className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Page Status
              </label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900">
                <option value="Active">Active (Published)</option>
                <option value="Inactive">Inactive (Draft)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Short Description / Subtitle
            </label>
            <input type="text" value={formData.shortDescription || ""} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Brief summary displayed at the top of the policy page" className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-800"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Page Content (HTML Supported) *
            </label>
            <textarea rows={14} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write or paste your HTML policy content here..." required className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-slate-800 leading-relaxed resize-y"/>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Supports HTML tags like <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;strong&gt;</code> for rich formatting.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button type="submit" disabled={saving} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50">
              {saving ? (<>
                  <FiLoader className="w-4 h-4 animate-spin"/>
                  <span>Saving...</span>
                </>) : (<>
                  <FiSave size={16}/>
                  <span>Save & Publish Changes</span>
                </>)}
            </button>
          </div>

        </form>)}

    </div>);
};
