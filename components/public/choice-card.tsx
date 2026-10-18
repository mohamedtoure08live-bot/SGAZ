import React from 'react';
import { Check } from 'lucide-react';

interface ChoiceCardProps {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  priceTag?: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function ChoiceCard({
  id,
  title,
  subtitle,
  badge,
  priceTag,
  icon,
  selected,
  onSelect,
  disabled = false,
}: ChoiceCardProps) {
  return (
    <div
      onClick={() => !disabled && onSelect()}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (!disabled) onSelect();
        }
      }}
      className={`relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
        selected
          ? 'border-red-600 bg-white shadow-md shadow-red-500/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
    >
      <div className="flex items-center gap-3.5 pr-2">
        {/* Icône enveloppée */}
        <div
          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            selected ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {icon}
        </div>

        {/* Détails du choix */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {title}
            </h4>
            {badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{subtitle}</p>
          {priceTag && (
            <span
              className={`text-xs font-bold mt-1 ${
                selected ? 'text-red-600' : 'text-slate-700'
              }`}
            >
              {priceTag}
            </span>
          )}
        </div>
      </div>

      {/* Bouton radio interactif avec coche */}
      <div
        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          selected
            ? 'border-red-600 bg-red-600 text-white shadow-sm'
            : 'border-slate-300 bg-white'
        }`}
      >
        {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </div>
  );
}
