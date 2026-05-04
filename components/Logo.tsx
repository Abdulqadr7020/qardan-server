import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 24 }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shackle */}
      <path 
        d="M30 35V28C30 17 38.9543 8 50 8C61.0457 8 70 17 70 28V35" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      {/* Shield Body */}
      <path 
        d="M50 92C50 92 85 80 85 45V30L50 18L15 30V45C15 80 50 92 50 92Z" 
        fill="currentColor" 
        fillOpacity="0.2"
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinejoin="round"
      />
      {/* Keyhole */}
      <circle cx="50" cy="52" r="7" fill="currentColor"/>
      <path d="M50 52L44 72H56L50 52Z" fill="currentColor"/>
    </svg>
  );
}
