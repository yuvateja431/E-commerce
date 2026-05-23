import React from "react";
import { motion } from "framer-motion";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #EDE9FF 0%, #F0EFFF 40%, #E8ECFF 100%)" }}
    >
      {/* Decorative corner shapes */}
      <div className="absolute top-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full bg-violet-200/40 blur-[80px]" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[260px] h-[260px] rounded-full bg-indigo-200/40 blur-[80px]" />
      <div className="absolute top-[60%] left-[5%] w-[120px] h-[120px] rounded-full bg-violet-300/20 blur-[40px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(99,102,241,0.12)] z-10 mx-4 px-8 pt-10 pb-10"
      >
        {/* Logo Icon */}
        <div className="flex flex-col items-center mb-7 text-center">
          <div className="w-14 h-14 bg-[#6366F1] rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(99,102,241,0.3)] mb-6">
            <span className="text-2xl font-black text-white tracking-tight">E</span>
          </div>
          <h1 className="text-[26px] font-black text-[#0F172A] tracking-tight">Welcome Back</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">Please enter your details to continue</p>
        </div>

        {children}
      </motion.div>
    </div>
  );
};
