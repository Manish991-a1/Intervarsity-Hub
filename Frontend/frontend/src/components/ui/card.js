import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};