'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'default' | 'badge' | 'card' | 'glow';
  inverted?: boolean;
}

export function Logo({
  size = 'md',
  showTagline = true,
  className = '',
  variant = 'default',
  inverted = false,
}: LogoProps) {
  // Dimensions adaptées au ratio du logo officiel
  const dimensions = {
    sm: { width: 120, height: 80, heightClass: 'h-9', cardPadding: 'p-1.5' },
    md: { width: 165, height: 110, heightClass: 'h-12 sm:h-14', cardPadding: 'p-2' },
    lg: { width: 220, height: 146, heightClass: 'h-16 sm:h-20', cardPadding: 'p-3' },
    xl: { width: 280, height: 186, heightClass: 'h-24 sm:h-28', cardPadding: 'p-4' },
  };

  const dim = dimensions[size] || dimensions.md;

  // Si on est en mode "carte", "badge" ou "inverted" pour fond sombre
  if (inverted || variant === 'card' || variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-md shadow-slate-900/10 transition-all hover:shadow-lg ${dim.cardPadding} ${className}`}
      >
        <Image
          src="/images/logo-sosgaz.jpg"
          alt="SOSGAZ DOMESTIC - Votre gaz, en un clic !"
          width={dim.width}
          height={dim.height}
          className={`${dim.heightClass} w-auto object-contain select-none`}
          priority
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src="/images/logo-sosgaz.jpg"
        alt="SOSGAZ DOMESTIC - Votre gaz, en un clic !"
        width={dim.width}
        height={dim.height}
        className={`${dim.heightClass} w-auto object-contain select-none`}
        priority
      />
    </div>
  );
}
