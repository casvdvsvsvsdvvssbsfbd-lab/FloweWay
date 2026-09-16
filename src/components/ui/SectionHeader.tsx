import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
  seeAllText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  onSeeAll,
  seeAllText = "Barchasi",
  className = '',
}) => {
  return (
    <div className={`flex items-end justify-between border-b border-stone-200/60 pb-2 ${className}`}>
      <div>
        <h2 className="text-sm sm:text-base font-bold tracking-tight text-stone-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="text-[11px] sm:text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors flex items-center gap-0.5 cursor-pointer shrink-0 pb-0.5 active:scale-95"
        >
          <span>{seeAllText}</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      )}
    </div>
  );
};
