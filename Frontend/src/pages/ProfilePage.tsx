import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { RootState } from "../store";
import { logout as logoutAction } from "../store/authSlice";
import api from "../services/api";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCheckCircle,
  FiLogOut,
  FiBell,
  FiEdit2
} from "react-icons/fi";

export const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(logoutAction());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Cover Card */}
        <div className="relative bg-gradient-to-r from-[#4F46E5] via-[#5B50E6] to-[#6366F1] rounded-3xl p-6 sm:p-8 shadow-md overflow-hidden mb-8">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 blur-xs pointer-events-none" />
          <div className="absolute -bottom-24 right-32 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/30 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shrink-0">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-indigo-100/90 text-sm font-medium mt-1">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition duration-200 shadow-sm border border-red-50"
              >
                <FiLogOut size={16} className="text-red-500" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">
              Account Panel
            </p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-600 transition duration-200">
              <FiUser size={18} />
              My Profile
            </button>

            <div className="pt-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/60 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs">
                  <FiShield size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Secure Account</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-snug mt-0.5">
                    Your account is protected with strong security
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50/60 rounded-xl text-sm font-bold transition duration-200 shadow-sm">
                  <FiEdit2 size={14} />
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Full Name Card */}
                <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FiUser size={20} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      FULL NAME
                    </span>
                    <span className="block font-bold text-gray-900 text-sm">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                </div>

                {/* Email Address Card */}
                <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      EMAIL ADDRESS
                    </span>
                    <span className="block font-bold text-gray-900 text-sm">
                      {user?.email}
                    </span>
                  </div>
                </div>

                {/* Account Status Card */}
                <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FiCheckCircle size={20} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      ACCOUNT STATUS
                    </span>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>

                {/* User Role Card */}
                <div className="p-4 rounded-2xl border border-gray-100 bg-white flex items-center gap-4 shadow-xs hover:border-indigo-100 transition duration-200">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      USER ROLE
                    </span>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase">
                      {user?.role || "USER"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



