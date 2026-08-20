import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getContactSettings, updateContactSettings } from "../../services/cmsService";
import { FiSave, FiLoader, FiGlobe, FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";
export const AdminContactSettingsPage = () => {
    const [formData, setFormData] = useState({
        businessName: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        googleMapsUrl: "",
        businessHours: "",
        facebookUrl: "",
        instagramUrl: "",
        twitterUrl: "",
        youtubeUrl: "",
        status: "Active",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        document.title = "Contact Information Settings | Admin Panel";
        fetchSettings();
    }, []);
    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getContactSettings();
            if (data) {
                setFormData(data);
            }
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to load Contact Settings");
        }
        finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.businessName?.trim() || !formData.email?.trim()) {
            toast.error("Business Name and Email are required.");
            return;
        }
        try {
            setSaving(true);
            await updateContactSettings(formData);
            toast.success("Contact Information Settings saved successfully.");
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save Contact Settings");
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
            Contact Settings
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/contact-us" className="hover:text-indigo-600 transition cursor-pointer">Content Management</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/contact-us" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Contact Settings</Link>
          </div>
        </div>

        <a href="/contact-us" target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2">
          <FiGlobe size={16}/>
          <span>View Live Contact Page</span>
        </a>
      </div>

      {loading ? (<div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
          <FiLoader className="w-6 h-6 animate-spin mx-auto text-blue-600"/>
          <p className="text-xs font-semibold text-slate-500">Loading Contact Settings...</p>
        </div>) : (<form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-8">
          
          {/* Section 1: Core Business Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. General Business Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business Name *
                </label>
                <input type="text" name="businessName" value={formData.businessName || ""} onChange={handleChange} placeholder="e.g. E-Commerce Store Inc." required className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select name="status" value={formData.status || "Active"} onChange={handleChange} className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Email *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                  <input type="email" name="email" value={formData.email || ""} onChange={handleChange} placeholder="support@ecommercestore.com" required className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                  <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="+1 (800) 555-0199" className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp Number
                </label>
                <input type="text" name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} placeholder="+1 (800) 555-0199" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Business Hours
              </label>
              <div className="relative">
                <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                <input type="text" name="businessHours" value={formData.businessHours || ""} onChange={handleChange} placeholder="e.g. Monday - Friday: 9:00 AM - 6:00 PM EST" className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>
            </div>
          </div>

          {/* Section 2: Address Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Physical Address & Location
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                <input type="text" name="address" value={formData.address || ""} onChange={handleChange} placeholder="100 Innovation Boulevard, Tech Park" className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input type="text" name="city" value={formData.city || ""} onChange={handleChange} placeholder="San Francisco" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Province
                </label>
                <input type="text" name="state" value={formData.state || ""} onChange={handleChange} placeholder="California" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input type="text" name="country" value={formData.country || ""} onChange={handleChange} placeholder="United States" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Postal Code
                </label>
                <input type="text" name="postalCode" value={formData.postalCode || ""} onChange={handleChange} placeholder="94105" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Google Maps URL
              </label>
              <input type="text" name="googleMapsUrl" value={formData.googleMapsUrl || ""} onChange={handleChange} placeholder="https://maps.google.com/..." className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
            </div>
          </div>

          {/* Section 3: Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. Social Media Handles & Portals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Facebook URL
                </label>
                <input type="url" name="facebookUrl" value={formData.facebookUrl || ""} onChange={handleChange} placeholder="https://facebook.com/yourpage" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Instagram URL
                </label>
                <input type="url" name="instagramUrl" value={formData.instagramUrl || ""} onChange={handleChange} placeholder="https://instagram.com/yourhandle" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Twitter / X URL
                </label>
                <input type="url" name="twitterUrl" value={formData.twitterUrl || ""} onChange={handleChange} placeholder="https://twitter.com/yourhandle" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  YouTube Channel URL
                </label>
                <input type="url" name="youtubeUrl" value={formData.youtubeUrl || ""} onChange={handleChange} placeholder="https://youtube.com/c/yourchannel" className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"/>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button type="submit" disabled={saving} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50">
              {saving ? (<>
                  <FiLoader className="w-4 h-4 animate-spin"/>
                  <span>Saving Settings...</span>
                </>) : (<>
                  <FiSave size={16}/>
                  <span>Save Contact Settings</span>
                </>)}
            </button>
          </div>

        </form>)}

    </div>);
};
