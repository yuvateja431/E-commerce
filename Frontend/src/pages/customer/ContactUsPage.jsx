import React, { useState, useEffect } from "react";
import { getContactSettings, createContactMessage } from "../../services/cmsService";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiLoader, FiCheckCircle, FiGlobe, FiMessageSquare, } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
export const ContactUsPage = () => {
    const [settings, setSettings] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);
    useEffect(() => {
        document.title = "Contact Us | E-Commerce Store";
        fetchSettings();
    }, []);
    const fetchSettings = async () => {
        try {
            setLoadingSettings(true);
            const data = await getContactSettings();
            setSettings(data);
        }
        catch {
            // Fallback silently if settings loading fails
        }
        finally {
            setLoadingSettings(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }
        try {
            setSubmitting(true);
            await createContactMessage(formData);
            toast.success("Thank you! Your message has been sent successfully.");
            setSubmittedSuccess(true);
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });
        }
        catch (err) {
            toast.error(err?.response?.data?.message || "Failed to send message. Please try again.");
        }
        finally {
            setSubmitting(false);
        }
    };
    return (<div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-xs border border-indigo-100 shadow-2xs">
            <FiMessageSquare className="w-4 h-4"/>
            <span>We are here to help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Us
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Have a question or feedback? Reach out to our customer support team and we will respond as soon as possible.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
            
            {/* Decorative background blur */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"/>

            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {settings?.businessName || "E-Commerce Store"}
              </h2>
              <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
                Contact information & operating hours for our customer service center.
              </p>
            </div>

            {loadingSettings ? (<div className="flex items-center space-x-3 text-indigo-200 py-6">
                <FiLoader className="w-5 h-5 animate-spin"/>
                <span className="text-xs font-medium">Loading details...</span>
              </div>) : (<div className="space-y-6 text-sm">
                
                {/* Email */}
                {settings?.email && (<div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-indigo-400 shrink-0">
                      <FiMail className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Email Us</p>
                      <a href={`mailto:${settings.email}`} className="font-medium text-white hover:text-indigo-300 transition">
                        {settings.email}
                      </a>
                    </div>
                  </div>)}

                {/* Phone */}
                {settings?.phone && (<div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-indigo-400 shrink-0">
                      <FiPhone className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Phone</p>
                      <a href={`tel:${settings.phone}`} className="font-medium text-white hover:text-indigo-300 transition">
                        {settings.phone}
                      </a>
                    </div>
                  </div>)}

                {/* WhatsApp */}
                {settings?.whatsapp && (<div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-emerald-400 shrink-0">
                      <FaWhatsapp className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">WhatsApp</p>
                      <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="font-medium text-white hover:text-emerald-400 transition">
                        {settings.whatsapp}
                      </a>
                    </div>
                  </div>)}

                {/* Address */}
                {(settings?.address || settings?.city) && (<div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-indigo-400 shrink-0">
                      <FiMapPin className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Address</p>
                      <p className="font-medium text-white leading-relaxed">
                        {[settings.address, settings.city, settings.state, settings.postalCode, settings.country]
                    .filter(Boolean)
                    .join(", ")}
                      </p>
                    </div>
                  </div>)}

                {/* Business Hours */}
                {settings?.businessHours && (<div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/10 rounded-2xl text-indigo-400 shrink-0">
                      <FiClock className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Business Hours</p>
                      <p className="font-medium text-white leading-relaxed">{settings.businessHours}</p>
                    </div>
                  </div>)}

              </div>)}

            {/* Social Links */}
            {settings && (<div className="pt-4 border-t border-white/10 space-y-3">
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Follow Us</p>
                <div className="flex items-center space-x-3">
                  {settings.facebookUrl && (<a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white">
                      <FaFacebook className="w-4 h-4"/>
                    </a>)}
                  {settings.instagramUrl && (<a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white">
                      <FaInstagram className="w-4 h-4"/>
                    </a>)}
                  {settings.twitterUrl && (<a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white">
                      <FaTwitter className="w-4 h-4"/>
                    </a>)}
                  {settings.youtubeUrl && (<a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white">
                      <FaYoutube className="w-4 h-4"/>
                    </a>)}
                  {settings.googleMapsUrl && (<a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white" title="Google Maps">
                      <FiGlobe className="w-4 h-4"/>
                    </a>)}
                </div>
              </div>)}

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xs">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6">Send Us a Message</h2>

            {submittedSuccess ? (<div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8"/>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Thank you for reaching out. A representative from our support team will get back to you shortly.
                </p>
                <button onClick={() => setSubmittedSuccess(false)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs">
                  Send Another Message
                </button>
              </div>) : (<form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Jane Doe" required className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-900 placeholder-slate-400"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-900 placeholder-slate-400"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-900 placeholder-slate-400"/>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Subject *
                    </label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Order Inquiry / Support" required className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-900 placeholder-slate-400"/>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Message *
                  </label>
                  <textarea name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="How can we help you today?" required className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-900 placeholder-slate-400 resize-y"/>
                </div>

                <button type="submit" disabled={submitting} className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold rounded-xl transition flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md shadow-indigo-500/20">
                  {submitting ? (<>
                      <FiLoader className="w-4 h-4 animate-spin"/>
                      <span>Sending...</span>
                    </>) : (<>
                      <FiSend className="w-4 h-4"/>
                      <span>Send Message</span>
                    </>)}
                </button>

              </form>)}

          </div>

        </div>

      </div>
    </div>);
};
