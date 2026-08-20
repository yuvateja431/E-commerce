import React from "react";
export const Button = ({ children, loading, variant = "primary", className = "", ...props }) => {
    const baseStyles = "px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-95",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95",
    };
    return (<button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? (<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>) : (children)}
    </button>);
};
