
import React from 'react';

const AppIcon = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="shield-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9F025E" />
            <stop offset="100%" stopColor="#F9C929" />
          </linearGradient>
        </defs>
        <path 
          d="M50,10 L90,30 V60 C90,75 75,85 50,95 C25,85 10,75 10,60 V30 L50,10z" 
          fill="url(#shield-gradient)"
          stroke="white"
          strokeWidth="2"
        />
        <path
          d="M40,50 L47,57 L65,40"
          fill="none"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default AppIcon;
