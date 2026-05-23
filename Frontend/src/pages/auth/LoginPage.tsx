import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { AuthLayout } from "../../layouts/AuthLayout";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield, FiLogIn, FiGrid } from "react-icons/fi";
import api from "../../services/api";
import { setAuth } from "../../store/authSlice";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      const { user, accessToken } = response.data.data;

      if (isAdminMode && user.role !== "ADMIN" && user.role !== "MANAGER") {
        toast.error("Access denied: Not an administrator");
        return;
      }

      dispatch(setAuth({ user, accessToken }));
      toast.success(isAdminMode ? "Admin session started!" : "Logged in successfully!");
      navigate(isAdminMode ? "/admin/dashboard" : from, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* ── Tab Toggle: Customer / Administrator ── */}
      <div className="flex rounded-2xl border border-slate-200 overflow-hidden mb-8 bg-white">
        <button
          type="button"
          onClick={() => setIsAdminMode(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[13px] font-bold transition-all ${
            !isAdminMode
              ? "text-[#6366F1] border-b-2 border-[#6366F1] bg-white"
              : "text-slate-400 hover:text-slate-600 bg-white"
          }`}
        >
          <FiUser size={16} />
          Customer
        </button>
        <button
          type="button"
          onClick={() => setIsAdminMode(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-[13px] font-bold transition-all ${
            isAdminMode
              ? "text-[#6366F1] border-b-2 border-[#6366F1] bg-white"
              : "text-slate-400 hover:text-slate-600 bg-white"
          }`}
        >
          <FiShield size={16} />
          Administrator
        </button>
      </div>

      {/* ── Section heading ── */}
      <div className="text-center mb-7">
        <h2 className="text-[22px] font-black text-[#0F172A]">
          {isAdminMode ? "Admin Login" : "Customer Login"}
        </h2>
        <p className="text-[13px] text-slate-500 mt-1">
          {isAdminMode ? "Enter admin credentials to access dashboard" : "Welcome back! Please login to your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-[13px] font-bold text-[#0F172A] mb-2">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className="w-full pl-11 pr-4 py-3.5 text-[13px] text-slate-700 bg-[#F8F8FF] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition placeholder-slate-400"
            />
          </div>
          {errors.email && (
            <p className="text-rose-500 text-[11px] font-medium mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[13px] font-bold text-[#0F172A] mb-2">Password</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              className="w-full pl-11 pr-12 py-3.5 text-[13px] text-slate-700 bg-[#F8F8FF] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-rose-500 text-[11px] font-medium mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2.5 text-[13px] text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="w-4 h-4 accent-[#6366F1] rounded border-slate-300 focus:ring-0 cursor-pointer"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-[13px] font-bold text-[#6366F1] hover:text-indigo-800 transition"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-black text-[14px] shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition-all hover:shadow-[0_12px_30px_rgba(99,102,241,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          style={{ background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)" }}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            isAdminMode ? <FiGrid size={18} /> : <FiLogIn size={18} />
          )}
          {loading ? "Signing in..." : isAdminMode ? "Launch Dashboard" : "Sign In"}
        </button>

        {/* Register link */}
        {!isAdminMode && (
          <p className="text-center text-[13px] text-slate-500 mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-black text-[#6366F1] underline decoration-2 underline-offset-4 hover:text-indigo-800 transition"
            >
              Create account
            </Link>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};
