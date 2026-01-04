
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`${className} relative group transition-transform hover:scale-110 active:rotate-3`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pixel Art Style Graduation Cap */}
        {/* Top Diamond */}
        <path d="M10 40L50 20L90 40L50 60L10 40Z" fill="#4C1D95" /> {/* Deep Purple Base */}
        <path d="M15 40L50 23L85 40L50 57L15 40Z" fill="#A855F7" /> {/* Main Lavender */}
        
        {/* Cap Body */}
        <path d="M30 50V70C30 75 40 80 50 80C60 80 70 75 70 70V50" fill="#4C1D95" />
        <path d="M35 52V68C35 72 42 75 50 75C58 75 65 72 65 68V52" fill="#7E22CE" />
        
        {/* Tassel */}
        <path d="M15 40V65" stroke="#FBBF24" strokeWidth="3" strokeLinecap="square" />
        <rect x="12" y="65" width="6" height="10" fill="#FBBF24" />
        <rect x="14" y="72" width="2" height="6" fill="#D97706" />

        {/* Shine Details */}
        <rect x="45" y="28" width="10" height="2" fill="white" fillOpacity="0.3" />
      </svg>
    </div>
  );
};

export default Logo;
