import React from 'react';

interface SamvadIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SamvadIcon({ className = "h-5 w-5", size = 'md' }: SamvadIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-7 w-7"
  };

  const dotSize = {
    sm: "0.8",
    md: "1",
    lg: "1.2"
  };

  const strokeWidth = {
    sm: "0.4",
    md: "0.5",
    lg: "0.7"
  };

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main conversation bubble */}
      <path 
        d="M8 12C8 8.5 10.5 6 14 6C17.5 6 20 8.5 20 12C20 15.5 17.5 18 14 18H8L6 20V12Z" 
        fill="currentColor" 
        opacity="0.9"
      />
      {/* Secondary bubble (reply) */}
      <path 
        d="M4 8C4 6 5.5 4 8 4C9.5 4 10.5 4.5 11 5.5C10 5.2 9 5.5 8.5 6C7.5 7 7.5 8.5 8.5 9.5C9 10 9.5 10 10 9.8C9.5 10.8 8.5 11 7.5 11H4L3 12V8Z" 
        fill="currentColor" 
        opacity="0.7"
      />
      {/* AI neural dots */}
      <circle cx="12" cy="10" r={dotSize[size]} fill="rgba(255,255,255,0.9)" />
      <circle cx="15" cy="10" r={dotSize[size]} fill="rgba(255,255,255,0.9)" />
      <circle cx="16" cy="12" r={dotSize[size]} fill="rgba(255,255,255,0.9)" />
      <circle cx="14" cy="14" r={dotSize[size]} fill="rgba(255,255,255,0.9)" />
      <circle cx="11" cy="14" r={dotSize[size]} fill="rgba(255,255,255,0.9)" />
      {/* Connection lines for neural network effect */}
      <path 
        d="M12 10L15 10M15 10L16 12M16 12L14 14M14 14L11 14M11 14L12 10" 
        stroke="rgba(255,255,255,0.7)" 
        strokeWidth={strokeWidth[size]} 
        fill="none"
      />
    </svg>
  );
}
