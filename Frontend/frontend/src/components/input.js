import React from "react";

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${className}`}
      {...props}
    />
  );
};