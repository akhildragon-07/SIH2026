'use client';

import React from 'react';
import { Check, Plus, X } from 'lucide-react';

interface SkillChipProps {
  label: string;
  icon?: string;
  category?: string;
  selected: boolean;
  onToggle: (skill: string) => void;
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: (skill: string) => void;
}

export default function SkillChip({
  label,
  icon,
  category,
  selected,
  onToggle,
  size = 'md',
  removable = false,
  onRemove
}: SkillChipProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(label);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove(label);
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs gap-1.5 rounded-xl',
    md: 'px-3.5 py-2 text-xs sm:text-sm gap-2 rounded-2xl',
    lg: 'px-4 py-2.5 text-sm gap-2.5 rounded-2xl'
  }[size];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      className={`group relative inline-flex items-center font-medium transition-all duration-200 cursor-pointer select-none ${sizeClasses} ${
        selected
          ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500 shadow-md shadow-emerald-500/20 scale-[1.02] ring-2 ring-emerald-500/30'
          : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800 hover:text-emerald-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10'
      }`}
    >
      {/* Icon / Emoji */}
      {icon && <span className="text-sm shrink-0">{icon}</span>}

      {/* Label & Optional Category Subtext */}
      <div className="text-left">
        <span className="font-semibold block">{label}</span>
        {category && (
          <span className="text-[10px] text-slate-400 font-normal block -mt-0.5">
            {category}
          </span>
        )}
      </div>

      {/* Selected Indicator / Animated Checkmark */}
      <div className="shrink-0 ml-1">
        {selected ? (
          removable ? (
            <span
              onClick={handleRemoveClick}
              className="grid size-4 place-items-center rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors"
            >
              <X size={11} />
            </span>
          ) : (
            <span className="grid size-4 place-items-center rounded-full bg-emerald-500 text-slate-950 font-bold animate-in zoom-in-50 duration-150">
              <Check size={11} className="stroke-[3]" />
            </span>
          )
        ) : (
          <span className="grid size-4 place-items-center rounded-full bg-slate-800 text-slate-400 group-hover:text-emerald-300 group-hover:bg-slate-700 transition-colors text-[10px]">
            <Plus size={11} />
          </span>
        )}
      </div>
    </button>
  );
}
