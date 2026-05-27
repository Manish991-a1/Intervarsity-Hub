import React from "react";

export const Button = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};