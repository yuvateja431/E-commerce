import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { AuthLayout } from "../../layouts/AuthLayout";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiUserPlus } from "react-icons/fi";
import api from "../../services/api";
import { setAuth } from "../../store/authSlice";
const registerSchema = z
    .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export const RegisterPage = () => {
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/auth/register", data);
            const { user, accessToken } = response.data.data;
            dispatch(setAuth({ user, accessToken }));
            toast.success("Account created successfully!");
            navigate("/");
        }
        catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (<AuthLayout>
      {/* Section heading */}
      <div className="text-center mb-7">
        <h2 className="text-[22px] font-black text-[#0F172A]">Create Account</h2>
        <p className="text-[13px] text-slate-500 mt-1">Join us today and start shopping!</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* First + Last Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">First Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
              <input placeholder="First name" {...register("firstName")} className="w-full pl-10 pr-3 py-3 text-[13px] text-slate-700 bg-[#F8F8FF] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition placeholder-slate-400"/>
            </div>
            {errors.firstName && (<p className="text-rose-500 text-[10px] font-medium mt-1">{errors.firstName.message}</p>)}
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Last Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
              <input placeholder="Last name" {...register("lastName")} className="w-full pl-10 pr-3 py-3 text-[13px] text-slate-700 bg-[#F8F8FF] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition placeholder-slate-400"/>
            </div>
            {errors.lastName && (<p className="text-rose-500 text-[10px] font-medium mt-1">{errors.lastName.message}</p>)}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
            <input type="email" placeholder="Enter your email address" {...register("email")} className="w-full pl-11 pr-4 py-3 text-[13px] text-slate-700 bg-[#F8F8FF] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition placeholder-slate-400"/>
          </div>
          {errors.email && (<p className="text-rose-500 text-[10px] font-medium mt-1">{errors.email.message}</p>)}
        </div>

        {/* Password */}
        <div>
          <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Password</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
            <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" {...register("password")} className="w-full pl-11 pr-12 py-3 text-[13px] text-slate-700 bg-[#F8F8FF] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition placeholder-slate-400"/>
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
              {showPassword ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
            </button>
          </div>
          {errors.password && (<p className="text-rose-500 text-[10px] font-medium mt-1">{errors.password.message}</p>)}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[12px] font-bold text-[#0F172A] mb-1.5">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
            <input type={showConfirm ? "text" : "password"} placeholder="Repeat your password" {...register("confirmPassword")} className="w-full pl-11 pr-12 py-3 text-[13px] text-slate-700 bg-[#F8F8FF] border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition placeholder-slate-400"/>
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
              {showConfirm ? <FiEyeOff size={15}/> : <FiEye size={15}/>}
            </button>
          </div>
          {errors.confirmPassword && (<p className="text-rose-500 text-[10px] font-medium mt-1">{errors.confirmPassword.message}</p>)}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-black text-[14px] shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2" style={{ background: "linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)" }}>
          {loading ? (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>) : (<FiUserPlus size={17}/>)}
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Login link */}
        <p className="text-center text-[13px] text-slate-500 mt-1">
          Already have an account?{" "}
          <Link to="/login" className="font-black text-[#6366F1] underline decoration-2 underline-offset-4 hover:text-indigo-800 transition">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>);
};
