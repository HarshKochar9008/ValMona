import React from 'react';

const HexagonalBanner = ({ 
  text = "LOGIN", 
  onClick, 
  className = "", 
  textColor = "text-gray-900",
  backgroundColor = "bg-white",
  borderColor = "border-white"
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main banner shape */}
      <div className={`
        relative 
        ${backgroundColor} 
        px-8 py-4 
        shadow-lg 
        border-2 
        ${borderColor}
        cursor-pointer
        transition-all 
        duration-200 
        hover:shadow-xl
        hover:scale-105
      `}>
        {/* Top-left diagonal cut */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[20px] border-t-transparent border-r-[20px] border-r-gray-800"></div>
        <div className="absolute top-0 left-0 w-0 h-0 border-t-[18px] border-t-transparent border-r-[18px] border-r-white"></div>
        
        {/* Top-right diagonal cut */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-transparent border-l-[20px] border-l-gray-800"></div>
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[18px] border-t-transparent border-l-[18px] border-l-white"></div>
        
        {/* Text content */}
        <span className={`font-bold text-lg uppercase tracking-wider ${textColor}`}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default HexagonalBanner; 