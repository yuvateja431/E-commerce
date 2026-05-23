import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { RootState } from "../store";
import { logout as logoutAction } from "../store/authSlice";
import api from "../services/api";
import { Button } from "../components/Button";

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
      // Even if API fails, clear local state
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 h-32 relative">
            <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600">
              {user?.firstName?.charAt(0)}
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-500">{user?.email}</p>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user?.role}
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Account ID</p>
                <p className="font-mono text-sm break-all">{user?.id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="font-semibold text-green-600">
                  {user?.isEmailVerified ? "Verified" : "Pending Verification"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
