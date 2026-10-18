import React from 'react';
import { OrderStatus } from '@/types';
import { STATUS_METADATA } from '@/lib/order-state';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function StatusBadge({ status, size = 'md', showDot = true }: StatusBadgeProps) {
  const meta = STATUS_METADATA[status] || {
    label: status,
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-300',
    dotColor: 'bg-slate-500',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} ${sizeClasses[size]} transition-all`}
    >
      {showDot && (
        <span className="relative flex shrink-0">
          {status === 'NOUVELLE' || status === 'EN_LIVRAISON' ? (
            <>
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${meta.dotColor}`}
              />
              <span className={`relative inline-flex rounded-full ${dotSizes[size]} ${meta.dotColor}`} />
            </>
          ) : (
            <span className={`inline-flex rounded-full ${dotSizes[size]} ${meta.dotColor}`} />
          )}
        </span>
      )}
      <span>{meta.label}</span>
    </span>
  );
}
