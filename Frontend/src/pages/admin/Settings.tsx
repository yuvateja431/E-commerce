import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  FiUser, FiLock, FiBell, FiSliders, FiGlobe, FiShield, 
  FiCamera, FiSmartphone, FiMonitor, FiCheck, FiAlertTriangle, 
  FiTrash2, FiSave, FiInfo, FiMoon, FiSun
} from "react-icons/fi";
import type { RootState } from "../../store";
import { updateUser } from "../../store/authSlice";
import api from "../../services/api";

type TabType = "profile" | "security" | "notifications" | "appearance" | "language" | "privacy";

export const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth?.user);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  
  // Form Saving States
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tab 1: Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "Super",
    lastName: user?.lastName || "Admin",
    email: user?.email || "superadmin@luxestore.in",
    phone: "+91 98765 43210",
  });

  // Tab 2: Security Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactor, setTwoFactor] = useState(true);
  const [activeDevices, setActiveDevices] = useState([
    { id: "1", type: "desktop", name: "Chrome on Windows 11", ip: "192.168.1.45", location: "Bengaluru, India", current: true },
    { id: "2", type: "mobile", name: "Safari on iPhone 15 Pro", ip: "192.168.1.102", location: "Mumbai, India", current: false },
    { id: "3", type: "desktop", name: "Firefox on macOS Sonoma", ip: "103.45.21.90", location: "London, UK", current: false },
  ]);

  // Tab 3: Notifications
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    stockAlerts: true,
    emailAlerts: true,
    pushAlerts: false,
    marketingAlerts: false,
  });

  // Tab 4: Appearance Settings
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [accentColor, setAccentColor] = useState<"indigo" | "purple" | "emerald" | "rose" | "amber">("indigo");
  const [layoutMode, setLayoutMode] = useState<"grid" | "compact">("grid");

  // Tab 5: Language & Region
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT+5:30)");
  const [currency, setCurrency] = useState("INR (₹)");

  // Tab 6: Privacy
  const [shareTelemetry, setShareTelemetry] = useState(true);
  const [showActiveStatus, setShowActiveStatus] = useState(true);

  // Sidebar Menu Config
  const sidebarItems = [
    { id: "profile" as TabType, label: "Profile Settings", icon: <FiUser /> },
    { id: "security" as TabType, label: "Security", icon: <FiLock /> },
    { id: "notifications" as TabType, label: "Notifications", icon: <FiBell /> },
    { id: "appearance" as TabType, label: "Appearance", icon: <FiSliders /> },
    { id: "language" as TabType, label: "Language & Region", icon: <FiGlobe /> },
    { id: "privacy" as TabType, label: "Privacy & Sessions", icon: <FiShield /> },
  ];

  // Accent Styles Lookup Table
  const accentClasses = {
    indigo: "from-indigo-600 to-indigo-700 bg-indigo-600 focus:ring-indigo-500/20 text-indigo-600 border-indigo-600",
    purple: "from-purple-600 to-purple-700 bg-purple-600 focus:ring-purple-500/20 text-purple-600 border-purple-600",
    emerald: "from-emerald-600 to-emerald-700 bg-emerald-600 focus:ring-emerald-500/20 text-emerald-600 border-emerald-600",
    rose: "from-rose-600 to-rose-700 bg-rose-600 focus:ring-rose-500/20 text-rose-600 border-rose-600",
    amber: "from-amber-500 to-amber-600 bg-amber-500 focus:ring-amber-500/20 text-amber-500 border-amber-500",
  };

  // Form Validation & Save Function
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "profile") {
        if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
          toast.error("Name fields cannot be blank");
          setIsSaving(false);
          return;
        }
        
        // Save via real profile update API
        const res = await api.patch("/auth/profile", {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
        });

        // Dispatch redux action to update global user state instantly
        if (res.data?.data) {
          dispatch(updateUser(res.data.data));
        } else {
          dispatch(updateUser({ 
            ...user, 
            firstName: profileForm.firstName, 
            lastName: profileForm.lastName 
          }));
        }
        toast.success("Profile settings updated successfully!");
      } 
      
      else if (activeTab === "security") {
        if (passwordForm.newPassword || passwordForm.currentPassword) {
          if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match!");
            setIsSaving(false);
            return;
          }
          if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            setIsSaving(false);
            return;
          }
          toast.success("Password updated successfully!");
          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          toast.success("Security configuration updated!");
        }
      } 
      
      else if (activeTab === "notifications") {
        toast.success("Notification preferences saved!");
      } 
      
      else if (activeTab === "appearance") {
        toast.success("Visual settings applied to dashboard!");
      } 
      
      else if (activeTab === "language") {
        toast.success("Localization variables saved!");
      } 
      
      else if (activeTab === "privacy") {
        toast.success("Privacy parameters saved!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit configurations");
    } finally {
      setIsSaving(false);
    }
  };

  // Session Revocation Logic
  const handleRevokeDevice = (id: string) => {
    setActiveDevices(prev => prev.filter(d => d.id !== id));
    toast.success("Session terminated and device credentials revoked");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Settings</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
            Configure system rules, administrators, and presentation parameters
          </p>
        </div>

        {/* Dynamic Save button */}
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition duration-250 cursor-pointer ${
            isSaving ? "opacity-75 cursor-not-allowed bg-indigo-600" : `bg-gradient-to-r ${accentClasses[accentColor]} hover:scale-[1.02]`
          }`}
        >
          {isSaving ? (
            <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSave size={15} />
          )}
          <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
        </button>
      </div>

      {/* Main Settings Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar Card (Glassmorphism layout) */}
        <div className="lg:col-span-1 bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-1.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3.5 mb-3">
            Configuration tabs
          </p>
          {sidebarItems.map((item) => {
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition duration-200 cursor-pointer ${
                  isTabActive
                    ? `bg-gradient-to-r ${accentClasses[accentColor]} text-white font-bold shadow-md shadow-indigo-600/10`
                    : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Detail View (Animate transitions) */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8"
            >
              
              {/* Profile Settings Section */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Admin Profile</h3>
                    <p className="text-xs text-gray-400 mt-1">Manage avatar picture, contact details, and role specifications</p>
                  </div>

                  {/* Profile Picture Upload Display */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <div className="relative group shrink-0">
                      <div className="h-20 w-20 bg-gradient-to-tr from-indigo-500 via-indigo-600 to-indigo-700 text-white rounded-full flex items-center justify-center font-black text-2xl border-4 border-white shadow-xl shadow-indigo-500/10">
                        {profileForm.firstName.charAt(0).toUpperCase()}{profileForm.lastName.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer">
                        <FiCamera size={18} />
                      </div>
                    </div>

                    <div className="text-center sm:text-left space-y-1">
                      <h4 className="text-sm font-extrabold text-gray-800">Administrator Avatar</h4>
                      <p className="text-[11px] text-gray-400">JPG, PNG, or WEBP up to 2MB. Square aspect recommended.</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                        <button className="px-3.5 py-1.5 bg-white border border-gray-100 text-[10px] font-bold text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 transition cursor-pointer">
                          Upload New
                        </button>
                        <button className="px-3.5 py-1.5 bg-red-50 border border-red-100 text-[10px] font-bold text-red-500 rounded-lg hover:bg-red-100/50 transition cursor-pointer">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">First Name</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={e => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-medium text-gray-800"
                        placeholder="First name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={e => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-medium text-gray-800"
                        placeholder="Last name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        readOnly
                        className="w-full px-4 py-2.5 text-xs bg-slate-100/70 border border-gray-100 rounded-xl focus:outline-none text-gray-400 font-medium cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-medium text-gray-800"
                        placeholder="Phone Number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Security Role</label>
                      <div className="flex items-center">
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-extrabold px-3 py-1.5 rounded-lg border border-indigo-100">
                          {user?.role || "ADMIN"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Configuration */}
              {activeTab === "security" && (
                <div className="space-y-8">
                  {/* Change Password Panel */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Security Credentials</h3>
                      <p className="text-xs text-gray-400 mt-1">Configure administrator login passwords and validation procedures</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-medium"
                          placeholder="••••••••"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-medium"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-medium"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication Switch */}
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-6">
                    <div className="space-y-1 max-w-lg">
                      <h4 className="text-sm font-extrabold text-gray-800">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-gray-400">
                        Add an extra layer of identity protection to this administrative account using temporary secure tokens
                      </p>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        twoFactor ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          twoFactor ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Device & Session Activity Card */}
                  <div className="pt-8 border-t border-slate-50 space-y-6">
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-800">Active Admin Sessions</h4>
                      <p className="text-xs text-gray-400 mt-1">Review active system entry credentials and browser contexts</p>
                    </div>

                    <div className="space-y-4">
                      {activeDevices.map((dev) => (
                        <div 
                          key={dev.id} 
                          className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl gap-4 hover:border-slate-200 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                              {dev.type === "desktop" ? <FiMonitor size={18} /> : <FiSmartphone size={18} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-gray-800">{dev.name}</p>
                                {dev.current && (
                                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-gray-400 font-medium mt-1">
                                IP: {dev.ip} · Location: {dev.location}
                              </p>
                            </div>
                          </div>

                          {!dev.current && (
                            <button
                              onClick={() => handleRevokeDevice(dev.id)}
                              className="px-3.5 py-2 text-[10px] font-bold text-red-500 hover:text-white bg-white hover:bg-red-500 border border-red-100 hover:border-red-500 rounded-xl transition cursor-pointer"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Preferences */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Notification Channels</h3>
                    <p className="text-xs text-gray-400 mt-1">Configure active system alerts and push indicators</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: "orderAlerts", label: "Real-time Order Alerts", desc: "Notify via audio and toast signals when users submit orders" },
                      { id: "stockAlerts", label: "Low Inventory stock warnings", desc: "Trigger background status warnings when listings fall below threshold" },
                      { id: "emailAlerts", label: "Consolidated Email Reports", desc: "Send daily system health statistics and revenue summaries to inbox" },
                      { id: "pushAlerts", label: "System Web Push Notifications", desc: "Show system update popups directly on operational browsers" },
                      { id: "marketingAlerts", label: "Store campaign alerts", desc: "Inform admin when automated coupons generate or expire" },
                    ].map((item) => {
                      const value = (notifications as any)[item.id];
                      return (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between gap-6 p-4 rounded-2xl hover:bg-slate-50/50 transition duration-150"
                        >
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-gray-800">{item.label}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{item.desc}</p>
                          </div>
                          
                          {/* Modern toggle switch */}
                          <button
                            onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !value }))}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              value ? `bg-indigo-600` : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                value ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Appearance Preferences */}
              {activeTab === "appearance" && (
                <div className="space-y-8">
                  {/* Theme Mode Toggle */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Theme Customization</h3>
                      <p className="text-xs text-gray-400 mt-1">Select workspace theme and interface configurations</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setThemeMode("light")}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer group ${
                          themeMode === "light" 
                            ? "bg-indigo-50/50 border-indigo-500 shadow-sm" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FiSun className={`text-lg ${themeMode === "light" ? "text-indigo-600" : "text-gray-400"}`} />
                          <span className="text-xs font-bold text-gray-800">Light Mode</span>
                        </div>
                        {themeMode === "light" && <FiCheck className="text-indigo-600" size={16} />}
                      </button>

                      <button
                        onClick={() => setThemeMode("dark")}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer group ${
                          themeMode === "dark" 
                            ? "bg-indigo-50/50 border-indigo-500 shadow-sm" 
                            : "bg-white border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FiMoon className={`text-lg ${themeMode === "dark" ? "text-indigo-600" : "text-gray-400"}`} />
                          <span className="text-xs font-bold text-gray-800">Dark Mode</span>
                        </div>
                        {themeMode === "dark" && <FiCheck className="text-indigo-600" size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Accent Swatch Controls */}
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Accent Theme Color</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Select theme accent for active buttons, sliders, and highlights</p>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {[
                        { id: "indigo", color: "bg-indigo-600" },
                        { id: "purple", color: "bg-purple-600" },
                        { id: "emerald", color: "bg-emerald-600" },
                        { id: "rose", color: "bg-rose-600" },
                        { id: "amber", color: "bg-amber-500" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setAccentColor(item.id as any)}
                          className={`h-7 w-7 rounded-full flex items-center justify-center transition hover:scale-110 cursor-pointer ${item.color} ${
                            accentColor === item.id ? "ring-4 ring-offset-2 ring-indigo-500/20" : ""
                          }`}
                        >
                          {accentColor === item.id && <FiCheck className="text-white text-xs" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout Option Panels */}
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Layout Architecture</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Configure layout densities for statistical analytics cards</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "grid", title: "Standard Grid view", desc: "Dynamic spacing and graphic elements" },
                        { id: "compact", title: "Compact Data view", desc: "Denser arrays suited for high-density monitoring" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLayoutMode(item.id as any)}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                            layoutMode === item.id 
                              ? "bg-slate-50/80 border-indigo-600 shadow-sm" 
                              : "bg-white border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <span className="text-xs font-bold text-gray-800">{item.title}</span>
                          <span className="text-[10px] text-gray-400 mt-1">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dashboard Preview Box */}
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Accent Interface Preview</h4>
                      <p className="text-[10px] text-gray-400 mt-1">Simulated mockup displaying current visual options</p>
                    </div>

                    {/* Miniature Dashboard Preview */}
                    <div className={`p-4 rounded-2xl border border-slate-100 transition shadow-sm ${
                      themeMode === "dark" ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 text-slate-900"
                    }`}>
                      <div className="flex items-center justify-between border-b border-slate-100/10 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${accentClasses[accentColor].split(" ")[2]}`} />
                          <span className="text-[9px] font-bold opacity-80">Store Console Preview</span>
                        </div>
                        <div className="h-2 w-10 bg-slate-300/40 rounded-full" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className={`p-2.5 rounded-xl border border-slate-100/5 bg-white/5 space-y-1.5 ${
                          layoutMode === "compact" ? "p-1.5" : "p-2.5"
                        }`}>
                          <div className="h-1.5 w-6 bg-slate-300/40 rounded-full" />
                          <div className={`h-2.5 w-10 rounded-md ${accentClasses[accentColor].split(" ")[2]}`} />
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-100/5 bg-white/5 space-y-1.5">
                          <div className="h-1.5 w-6 bg-slate-300/40 rounded-full" />
                          <div className="h-2.5 w-10 bg-slate-300/40 rounded-md" />
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-100/5 bg-white/5 space-y-1.5">
                          <div className="h-1.5 w-6 bg-slate-300/40 rounded-full" />
                          <div className="h-2.5 w-10 bg-slate-300/40 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Language & Regional Parameters */}
              {activeTab === "language" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Localization Parameters</h3>
                    <p className="text-xs text-gray-400 mt-1">Configure workspace localization, dates, and currency values</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Language</label>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-semibold text-gray-800"
                      >
                        <option>English (US)</option>
                        <option>Spanish (Español)</option>
                        <option>French (Français)</option>
                        <option>Hindi (हिन्दी)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">System Timezone</label>
                      <select
                        value={timezone}
                        onChange={e => setTimezone(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-semibold text-gray-800"
                      >
                        <option>Asia/Kolkata (GMT+5:30)</option>
                        <option>America/New_York (EST/GMT-5)</option>
                        <option>Europe/London (GMT+0)</option>
                        <option>Europe/Paris (CET/GMT+1)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Transactional Currency</label>
                      <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition font-semibold text-gray-800"
                      >
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy and Telemetry Settings */}
              {activeTab === "privacy" && (
                <div className="space-y-8">
                  {/* General Privacy Controls */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 tracking-tight">Privacy Settings</h3>
                      <p className="text-xs text-gray-400 mt-1">Configure sharing preferences, audit telemetry, and account deletion rules</p>
                    </div>

                    <div className="space-y-4">
                      {/* Telemetry Switch */}
                      <div className="flex items-center justify-between gap-6 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-gray-800">Share Telemetry Analytics</p>
                          <p className="text-[10px] text-gray-400 font-medium">Send diagnostic statistics to assist console improvements</p>
                        </div>
                        <button
                          onClick={() => setShareTelemetry(!shareTelemetry)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            shareTelemetry ? "bg-indigo-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              shareTelemetry ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Active Status Switch */}
                      <div className="flex items-center justify-between gap-6 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-gray-800">Display Online status</p>
                          <p className="text-[10px] text-gray-400 font-medium">Allow other backend administrators to see active status indicator</p>
                        </div>
                        <button
                          onClick={() => setShowActiveStatus(!showActiveStatus)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            showActiveStatus ? "bg-indigo-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              showActiveStatus ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Account Deletion Area */}
                  <div className="pt-8 border-t border-red-100 space-y-6">
                    <div className="p-6 bg-red-50/50 border border-red-100 rounded-2xl flex flex-col sm:flex-row items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FiAlertTriangle size={20} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-extrabold text-red-900 uppercase tracking-wide">Danger Zone: Delete Account</h4>
                        <p className="text-xs text-red-700 font-medium leading-relaxed">
                          This action terminates this console access token instantly, wipes localized cache data, and revokes all active session keys. This operation cannot be undone.
                        </p>
                        
                        <button
                          onClick={() => {
                            if (window.confirm("CRITICAL WARNING: Are you certain you want to destroy this admin profile?")) {
                              setIsDeleting(true);
                              setTimeout(() => {
                                setIsDeleting(false);
                                toast.error("Account deletion disabled for security demo reasons");
                              }, 1000);
                            }
                          }}
                          className="mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-[11px] font-bold text-white rounded-xl shadow-md transition duration-200 shrink-0 cursor-pointer hover:scale-[1.02]"
                        >
                          {isDeleting ? "Terminating..." : "Delete Administrative Account"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
