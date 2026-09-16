import React from 'react';

export interface CategoryChipProps {
  id: string;
  label: string;
  imageUrl?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  id,
  label,
  imageUrl,
  icon,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      id={`cat-chip-${id}`}
      type="button"
      onClick={onClick}
      className={`h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-2 text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 active:scale-95 select-none ${
        isActive
          ? 'bg-emerald-600 text-white shadow-xs border border-emerald-600'
          : 'bg-white hover:bg-emerald-50/70 border border-stone-200/90 text-stone-800'
      } ${className}`}
    >
      {imageUrl ? (
        <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-neutral-200">
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ) : icon ? (
        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
          {icon}
        </div>
      ) : null}

      <span>{label}</span>
    </button>
  );
};
