import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Modern Futuristic Geometric Logo Mark */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#070913]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-400 transition-colors group-hover:text-cyan-300"
          >
            {/* Hexagonal Futuristic 'N' Glyph */}
            <path
              d="M6 19V5L12 14L18 5V19"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="14" r="1.5" fill="#06B6D4" />
          </svg>
        </div>
        {/* Ambient glow point */}
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 blur-[2px]" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display ${textSizes[size]} font-extrabold tracking-wider text-white uppercase`}
            >
              NEXORINA
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-indigo-400/90 uppercase -mt-1">
            PROTOCOL
          </span>
        </div>
      )}
    </div>
  );
};
