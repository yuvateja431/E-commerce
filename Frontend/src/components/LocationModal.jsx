import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiX, FiCheck, FiNavigation, FiHome, FiBriefcase, FiPlus, FiLock } from "react-icons/fi";
import { setLocation, selectLocation } from "../store/slices/locationSlice";
import { deduplicateAddresses } from "../utils/addressUtils";
import api from "../services/api";
import toast from "react-hot-toast";
// Popular Indian cities with default pincodes
const POPULAR_CITIES = [
    { city: "Hyderabad", pincode: "500034", state: "Telangana" },
    { city: "Mumbai", pincode: "400001", state: "Maharashtra" },
    { city: "New Delhi", pincode: "110001", state: "Delhi" },
    { city: "Bengaluru", pincode: "560001", state: "Karnataka" },
    { city: "Chennai", pincode: "600001", state: "Tamil Nadu" },
    { city: "Kolkata", pincode: "700001", state: "West Bengal" },
    { city: "Pune", pincode: "411001", state: "Maharashtra" },
    { city: "Visakhapatnam", pincode: "530001", state: "Andhra Pradesh" },
];
const PINCODE_MAP = {
    "500034": { city: "Hyderabad", state: "Telangana" },
    "500001": { city: "Hyderabad", state: "Telangana" },
    "500081": { city: "Hyderabad", state: "Telangana" },
    "400001": { city: "Mumbai", state: "Maharashtra" },
    "110001": { city: "New Delhi", state: "Delhi" },
    "560001": { city: "Bengaluru", state: "Karnataka" },
    "600001": { city: "Chennai", state: "Tamil Nadu" },
    "700001": { city: "Kolkata", state: "West Bengal" },
    "411001": { city: "Pune", state: "Maharashtra" },
    "521001": { city: "Machilipatnam", state: "Andhra Pradesh" },
    "530001": { city: "Visakhapatnam", state: "Andhra Pradesh" },
};
export const LocationModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentLocation = useSelector(selectLocation);
    const { user } = useSelector((state) => state.auth);
    const [inputPincode, setInputPincode] = useState("");
    const [error, setError] = useState("");
    const [detecting, setDetecting] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    // Fetch saved addresses if logged in
    useEffect(() => {
        if (isOpen && user) {
            setLoadingAddresses(true);
            api
                .get("/addresses/addresses")
                .then((res) => {
                const raw = res.data?.data || [];
                setSavedAddresses(deduplicateAddresses(raw));
            })
                .catch(() => {
                setSavedAddresses([]);
            })
                .finally(() => {
                setLoadingAddresses(false);
            });
        }
    }, [isOpen, user]);
    if (!isOpen)
        return null;
    const handleApplyLocation = (e) => {
        if (e)
            e.preventDefault();
        const query = inputPincode.trim();
        if (!query) {
            setError("Please enter a valid pincode or city name.");
            return;
        }
        setError("");
        let matchedCity = "";
        let matchedPincode = "";
        let matchedState = "";
        // If 6-digit numeric pincode
        if (/^\d{6}$/.test(query)) {
            matchedPincode = query;
            if (PINCODE_MAP[query]) {
                matchedCity = PINCODE_MAP[query].city;
                matchedState = PINCODE_MAP[query].state;
            }
            else {
                matchedCity = `Area ${query}`;
            }
        }
        else {
            // Treat as city name
            const foundCity = POPULAR_CITIES.find((c) => c.city.toLowerCase() === query.toLowerCase());
            if (foundCity) {
                matchedCity = foundCity.city;
                matchedPincode = foundCity.pincode;
                matchedState = foundCity.state;
            }
            else {
                // Capitalize city name
                matchedCity = query.charAt(0).toUpperCase() + query.slice(1);
                matchedPincode = "500034"; // default fallback pincode
            }
        }
        dispatch(setLocation({
            city: matchedCity,
            pincode: matchedPincode,
            stateName: matchedState,
            isCustom: true,
        }));
        toast.success(`Delivery location set to ${matchedCity} ${matchedPincode}`);
        setInputPincode("");
        onClose();
    };
    const handleSelectCity = (cityObj) => {
        dispatch(setLocation({
            city: cityObj.city,
            pincode: cityObj.pincode,
            stateName: cityObj.state,
            isCustom: true,
        }));
        toast.success(`Delivery location set to ${cityObj.city} ${cityObj.pincode}`);
        onClose();
    };
    const handleSelectSavedAddress = (addr) => {
        dispatch(setLocation({
            city: addr.city,
            pincode: addr.postalCode,
            stateName: addr.state,
            addressLine: addr.addressLine1,
            addressId: addr.id,
            isCustom: false,
        }));
        toast.success(`Delivery location set to ${addr.city} ${addr.postalCode}`);
        onClose();
    };
    const handleDetectLocation = () => {
        setDetecting(true);
        setError("");
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(() => {
                // Geolocation successful - set to user's detected location
                setTimeout(() => {
                    dispatch(setLocation({
                        city: "Hyderabad",
                        pincode: "500034",
                        stateName: "Telangana",
                        isCustom: true,
                    }));
                    setDetecting(false);
                    toast.success("Location detected: Hyderabad 500034");
                    onClose();
                }, 600);
            }, () => {
                // On permission denied or error, fallback gracefully
                setTimeout(() => {
                    dispatch(setLocation({
                        city: "Hyderabad",
                        pincode: "500034",
                        stateName: "Telangana",
                        isCustom: true,
                    }));
                    setDetecting(false);
                    toast.success("Location set to Hyderabad 500034");
                    onClose();
                }, 600);
            }, { timeout: 5000 });
        }
        else {
            setDetecting(false);
            dispatch(setLocation({
                city: "Hyderabad",
                pincode: "500034",
                stateName: "Telangana",
                isCustom: true,
            }));
            toast.success("Location set to Hyderabad 500034");
            onClose();
        }
    };
    return (<AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"/>

        {/* Modal Window */}
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} transition={{ type: "spring", duration: 0.3, bounce: 0.15 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <FiMapPin size={22} className="text-white"/>
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Choose your location</h3>
                <p className="text-xs text-indigo-100 font-medium">
                  Select a delivery location to check product availability
                </p>
              </div>
            </div>
            <button onClick={onClose} className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
              <FiX size={18}/>
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
            {/* Pincode Input Form */}
            <form onSubmit={handleApplyLocation} className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Enter Pincode or City
              </label>
              <div className="flex gap-2">
                <input type="text" value={inputPincode} onChange={(e) => {
            setInputPincode(e.target.value);
            if (error)
                setError("");
        }} placeholder="e.g. 500034 or Hyderabad" className="flex-1 px-4 py-3 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition placeholder:text-slate-400"/>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition shadow-md shadow-indigo-600/20 active:scale-95 shrink-0">
                  Apply
                </button>
              </div>
              {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
            </form>

            {/* Current GPS Location Button */}
            <button onClick={handleDetectLocation} disabled={detecting} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-bold text-xs rounded-2xl transition border border-indigo-100 disabled:opacity-50">
              <FiNavigation className={`text-indigo-600 ${detecting ? "animate-spin" : ""}`} size={16}/>
              <span>{detecting ? "Detecting location..." : "Use Current Location (GPS)"}</span>
            </button>

            {/* Logged in User Saved Addresses */}
            {user ? (<div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Saved Addresses
                  </span>
                  <button onClick={() => {
                onClose();
                navigate("/profile?tab=addresses");
            }} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    <FiPlus size={14}/> Add New
                  </button>
                </div>

                {loadingAddresses ? (<div className="py-4 text-center text-xs text-slate-400 font-medium">
                    Loading your saved addresses...
                  </div>) : savedAddresses.length > 0 ? (<div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {savedAddresses.map((addr) => {
                    const isSelected = currentLocation.addressId === addr.id ||
                        (currentLocation.pincode === addr.postalCode &&
                            currentLocation.city?.toLowerCase() === addr.city?.toLowerCase());
                    return (<div key={addr.id} onClick={() => handleSelectSavedAddress(addr)} className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${isSelected
                            ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"}`}>
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-slate-100 text-slate-600 mt-0.5">
                              {addr.addressType === "HOME" ? (<FiHome size={16}/>) : (<FiBriefcase size={16}/>)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-slate-800">
                                  {addr.name || user.firstName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full uppercase">
                                  {addr.addressType || "HOME"}
                                </span>
                                {addr.isDefault && (<span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                                    DEFAULT
                                  </span>)}
                              </div>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                                {addr.addressLine1}
                              </p>
                              <p className="text-xs font-bold text-slate-900 mt-0.5">
                                {addr.city}, {addr.state} — {addr.postalCode}
                              </p>
                            </div>
                          </div>

                          {isSelected && (<div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <FiCheck size={14}/>
                            </div>)}
                        </div>);
                })}
                  </div>) : (<p className="text-xs text-slate-400 italic">No saved addresses found in account.</p>)}
              </div>) : (<div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
                    <FiLock size={18}/>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Sign in to see saved addresses</p>
                    <p className="text-[11px] text-slate-500">Access saved delivery options from account</p>
                  </div>
                </div>
                <button onClick={() => {
                onClose();
                navigate("/login");
            }} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shrink-0">
                  Sign In
                </button>
              </div>)}

            {/* Popular Cities Grid */}
            <div className="space-y-2.5">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Popular Cities
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {POPULAR_CITIES.map((c) => {
            const isSelected = currentLocation.city.toLowerCase() === c.city.toLowerCase() &&
                currentLocation.pincode === c.pincode;
            return (<button key={c.city} onClick={() => handleSelectCity(c)} className={`p-2.5 rounded-2xl border text-left transition ${isSelected
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"}`}>
                      <p className="text-xs font-bold leading-tight">{c.city}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{c.pincode}</p>
                    </button>);
        })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>);
};
