import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showTagline = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'scale-75 origin-left',
    md: 'scale-90 sm:scale-100 origin-left',
    lg: 'scale-110 sm:scale-125 origin-left',
    xl: 'scale-125 sm:scale-150 origin-center',
  };

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className={`flex items-center gap-2.5 transition-transform ${sizeClasses[size]}`}>
        {/* Symbole officiel : Bouteille de gaz + Flamme + Scooter */}
        <div className="relative flex items-center justify-center shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 via-red-500 to-amber-500 shadow-md shadow-red-500/20 p-2 text-white">
          {/* SVG Bouteille et Flamme */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Poignée supérieure de la bouteille */}
            <path
              d="M14 6C14 4.89543 14.8954 4 16 4H24C25.1046 4 26 4.89543 26 6V9H14V6Z"
              fill="#FFFFFF"
              fillOpacity="0.9"
            />
            {/* Corps de la bouteille */}
            <rect x="10" y="9" width="20" height="25" rx="6" fill="#FFFFFF" />
            {/* Robinet central */}
            <rect x="18" y="2" width="4" height="3" rx="1" fill="#FFD100" />
            {/* Flamme intérieure */}
            <path
              d="M20 15C20 15 24 19 24 23C24 25.5 22.2 27.5 20 27.5C17.8 27.5 16 25.5 16 23C16 20 18 18 18 18C18 18 17.5 19.5 18 20.5C18.5 21.5 19.5 22 20 20C20.5 18 20 15 20 15Z"
              fill="#E52020"
            />
            {/* Anneau de vitesse dynamique */}
            <path
              d="M32 18C34 22 33 28 28 32"
              stroke="#FFD100"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Typographie de marque : SOSGAZ DOMESTIC */}
        <div className="flex flex-col">
          <div className="flex items-baseline font-black tracking-tighter text-2xl leading-none italic">
            <span className="text-[#E52020] drop-shadow-sm">SOS</span>
            <span className="text-slate-900 tracking-tight">GAZ</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-[2px] w-3 bg-[#E52020] rounded-full" />
            <span className="text-[10px] font-black tracking-widest text-slate-800 uppercase">
              DOMESTIC
            </span>
            <div className="h-[2px] w-3 bg-[#E52020] rounded-full" />
          </div>
        </div>
      </div>

      {/* Slogan officiel en script dynamique */}
      {showTagline && (
        <span className="text-xs font-semibold italic text-slate-600 pl-1 mt-1 font-serif tracking-tight">
          Votre gaz, en un clic !
        </span>
      )}
    </div>
  );
}
