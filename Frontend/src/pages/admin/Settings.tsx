import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  FiUser, FiLock, FiBell, FiGlobe, FiShield, 
  FiCamera, FiSmartphone, FiMonitor, FiCheck,
  FiTrash2, FiSave, FiChevronRight, FiUploadCloud, FiAperture
} from "react-icons/fi";
import type { RootState } from "../../store";
import { updateUser } from "../../store/authSlice";

type TabType = "profile" | "security" | "notifications" | "appearance" | "language" | "privacy";

export const AdminSettingsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth?.user);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  
  // Form Saving States
  const [isSaving, setIsSaving] = useState(false);

  // Tab 1: Profile Form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "Super",
    lastName: user?.lastName || "Admin",
    email: user?.email || "superadmin@eurestore.in",
    phone: "+91 98765 43210",
    role: user?.role || "ADMIN",
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
    { id: "profile" as TabType, label: "Profile Settings", icon: <FiUser size={18} /> },
    { id: "security" as TabType, label: "Security", icon: <FiLock size={18} /> },
    { id: "notifications" as TabType, label: "Notifications", icon: <FiBell size={18} /> },
    { id: "appearance" as TabType, label: "Appearance", icon: <FiAperture size={18} /> },
    { id: "language" as TabType, label: "Language & Region", icon: <FiGlobe size={18} /> },
    { id: "privacy" as TabType, label: "Privacy & Sessions", icon: <FiShield size={18} /> },
  ];

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
        dispatch(updateUser({
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
        }));
        toast.success("Admin profile details saved!");
      } 
      else if (activeTab === "security") {
        if (passwordForm.newPassword || passwordForm.confirmPassword) {
          if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match!");
            setIsSaving(false);
            return;
          }
        }
        toast.success("Security credentials updated!");
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

  const handleRevokeDevice = (id: string) => {
    setActiveDevices(prev => prev.filter(d => d.id !== id));
    toast.success("Session terminated and device credentials revoked");
  };

  const initials = `${profileForm.firstName.charAt(0)}${profileForm.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            style={{
              fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              fontStyle: 'normal',
              fontWeight: 700,
              color: 'rgb(17, 24, 39)',
              fontSize: '24px',
              lineHeight: '32px'
            }}
          >
            Settings
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Link to="/admin/dashboard" className="hover:text-indigo-600 transition cursor-pointer">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/settings" className="hover:text-indigo-600 transition cursor-pointer">Orders &amp; Delivery</Link>
            <span className="text-slate-400">&gt;</span>
            <Link to="/admin/settings" className="text-[#4f39f6] font-bold hover:underline cursor-pointer">Settings</Link>
          </div>
        </div>

        {/* Top Save Configuration Button */}
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#4f39f6] hover:bg-[#4330d8] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md transition flex items-center gap-2.5 cursor-pointer shrink-0 disabled:opacity-75"
        >
          {isSaving ? (
            <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSave size={17} />
          )}
          <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
        </button>
      </div>

      {/* Main Grid Layout: Sidebar & Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        
        {/* Navigation Sidebar Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100/80 space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3.5 mb-3.5">
            CONFIGURATION TABS
          </p>

          <div className="space-y-1.5">
            {sidebarItems.map((item) => {
              const isTabActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                    isTabActive
                      ? "bg-[#4f39f6] text-white font-bold shadow-xs"
                      : "text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={isTabActive ? "text-white" : "text-slate-500"}>
                      {item.icon}
                    </span>
                    <span className="text-xs sm:text-sm font-bold tracking-tight">{item.label}</span>
                  </div>

                  {isTabActive && (
                    <FiChevronRight size={17} className="text-white/90" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Detail View Panel */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100/80 space-y-7"
            >
              
              {/* TAB 1: Profile Settings */}
              {activeTab === "profile" && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Admin Profile
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Manage avatar picture, contact details, and role specifications.
                    </p>
                  </div>

                  {/* Avatar Card Box */}
                  <div className="bg-[#FAFAFC] border border-purple-100/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-full bg-[#4f39f6] text-white font-extrabold text-2xl flex items-center justify-center shadow-sm">
                          {initials}
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-600 absolute bottom-0 right-0 shadow-2xs cursor-pointer hover:bg-slate-50 transition">
                          <FiCamera size={14} />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                          Administrator Avatar
                        </h4>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                          JPG, PNG, or WEBP up to 2MB. Source aspect recommended.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => toast.success("Avatar upload modal opened")}
                        className="px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer shadow-2xs"
                      >
                        <FiUploadCloud size={15} />
                        <span>Upload New</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.success("Avatar reset to default")}
                        className="px-4 py-2.5 bg-white border border-rose-200/90 rounded-xl text-rose-500 font-bold text-xs hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer shadow-2xs"
                      >
                        <FiTrash2 size={15} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Form Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        FIRST NAME
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={e => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4.5 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition shadow-2xs"
                        placeholder="First Name"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        LAST NAME
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={e => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4.5 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition shadow-2xs"
                        placeholder="Last Name"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4.5 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition shadow-2xs"
                        placeholder="Email Address"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        PHONE NUMBER
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4.5 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition shadow-2xs"
                        placeholder="Phone Number"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        SECURITY ROLE
                      </label>
                      <span className="bg-[#F4EFFE] text-[#4f39f6] font-extrabold text-xs px-4 py-2 rounded-xl uppercase tracking-wider border border-purple-100/60 inline-block">
                        {profileForm.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Security */}
              {activeTab === "security" && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Security &amp; Credentials
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Update your password, two-factor authentication, and monitor active sessions.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Change Password</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={passwordForm.currentPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="px-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="px-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="px-4 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div className="bg-[#FAFAFC] border border-purple-100/60 rounded-3xl p-6 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">Two-Factor Authentication (2FA)</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Secure your admin account with multi-factor verification.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={`w-12 h-6 rounded-full p-1 transition duration-200 cursor-pointer ${twoFactor ? "bg-[#4f39f6]" : "bg-slate-300"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition duration-200 ${twoFactor ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* Active Devices */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Device Sessions</h4>
                    <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
                      {activeDevices.map(device => (
                        <div key={device.id} className="p-4 flex items-center justify-between bg-white">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4f39f6] flex items-center justify-center">
                              {device.type === "desktop" ? <FiMonitor size={18} /> : <FiSmartphone size={18} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{device.name}</p>
                              <p className="text-xs text-slate-400">{device.location} • {device.ip}</p>
                            </div>
                          </div>

                          {device.current ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Active Now</span>
                          ) : (
                            <button
                              onClick={() => handleRevokeDevice(device.id)}
                              className="text-xs font-bold text-rose-500 hover:text-rose-700 transition"
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

              {/* TAB 3: Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Notification Preferences
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Configure real-time order alerts, inventory notifications, and marketing digests.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "orderAlerts", label: "New Order Alerts", desc: "Receive immediate notification when a customer places an order" },
                      { key: "stockAlerts", label: "Low Inventory Warnings", desc: "Get alerted when product inventory drops below threshold" },
                      { key: "emailAlerts", label: "System Email Reports", desc: "Daily summary of store sales and analytics delivered to inbox" },
                      { key: "pushAlerts", label: "Browser Push Notifications", desc: "Allow desktop notifications while dashboard is open" }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAFC] border border-purple-100/60">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                          className={`w-12 h-6 rounded-full p-1 transition duration-200 cursor-pointer ${(notifications as any)[item.key] ? "bg-[#4f39f6]" : "bg-slate-300"}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition duration-200 ${(notifications as any)[item.key] ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Appearance */}
              {activeTab === "appearance" && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Appearance &amp; Interface
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Customize color schemes, density layout, and visual display options.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Theme Mode</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setThemeMode("light")}
                        className={`p-5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                          themeMode === "light" ? "border-[#4f39f6] bg-[#F4EFFE]/40" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Light Mode</p>
                          <p className="text-xs text-slate-400 mt-0.5">Clean high-contrast theme</p>
                        </div>
                        {themeMode === "light" && <FiCheck className="text-[#4f39f6]" size={20} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setThemeMode("dark")}
                        className={`p-5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                          themeMode === "dark" ? "border-[#4f39f6] bg-[#F4EFFE]/40" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Dark Mode</p>
                          <p className="text-xs text-slate-400 mt-0.5">Sleek dark theme</p>
                        </div>
                        {themeMode === "dark" && <FiCheck className="text-[#4f39f6]" size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Language & Region */}
              {activeTab === "language" && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Language &amp; Localization
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Set preferred admin panel language, timezone, and currency formats.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        LANGUAGE
                      </label>
                      <select
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                        className="w-full px-4.5 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="English (US)">English (US)</option>
                        <option value="English (UK)">English (UK)</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        TIMEZONE
                      </label>
                      <select
                        value={timezone}
                        onChange={e => setTimezone(e.target.value)}
                        className="w-full px-4.5 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                        <option value="UTC (GMT+0:00)">UTC (GMT+0:00)</option>
                        <option value="America/New_York (EST)">America/New_York (EST)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        CURRENCY
                      </label>
                      <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="w-full px-4.5 py-3 rounded-2xl bg-white border border-slate-200/90 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: Privacy & Sessions */}
              {activeTab === "privacy" && (
                <div className="space-y-7">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Privacy &amp; Data Control
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Manage data sharing, telemetry collection, and active online presence.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAFC] border border-purple-100/60">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Share Telemetry &amp; Performance Data</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Help improve platform stability by sharing anonymous diagnostic reports</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShareTelemetry(!shareTelemetry)}
                        className={`w-12 h-6 rounded-full p-1 transition duration-200 cursor-pointer ${shareTelemetry ? "bg-[#4f39f6]" : "bg-slate-300"}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition duration-200 ${shareTelemetry ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAFAFC] border border-purple-100/60">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Show Online Active Status</p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Display active status indicator to co-admins on team chat</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowActiveStatus(!showActiveStatus)}
                        className={`w-12 h-6 rounded-full p-1 transition duration-200 cursor-pointer ${showActiveStatus ? "bg-[#4f39f6]" : "bg-slate-300"}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition duration-200 ${showActiveStatus ? "translate-x-6" : "translate-x-0"}`} />
                      </button>
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

export default AdminSettingsPage;



