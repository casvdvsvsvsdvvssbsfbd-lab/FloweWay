import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onClear?: () => void;
  onClick?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  onClick,
  placeholder = 'Search plants, pots, care accessories...',
  autoFocus = false,
  size = 'md',
  className = '',
}) => {
  const heightStyles = {
    sm: 'h-10 pl-10 pr-9 text-xs',
    md: 'h-11 sm:h-12 pl-11 pr-10 text-sm',
    lg: 'h-13 sm:h-14 pl-12 pr-12 text-sm sm:text-base',
  };

  const iconStyles = {
    sm: 'w-4 h-4 left-3.5',
    md: 'w-4 h-4 sm:w-5 sm:h-5 left-4',
    lg: 'w-5 h-5 left-4',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative w-full flex items-center ${className}`}
      onClick={onClick}
    >
      <Search
        className={`text-[#737373] absolute pointer-events-none stroke-[2] ${iconStyles[size]}`}
      />

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full ${heightStyles[size]} bg-[#f8f8f7] rounded-full text-[#111111] placeholder:text-[#888888] border border-transparent hover:border-[#e0e0df] focus:border-[#111111] focus:bg-white focus:outline-hidden transition-all`}
      />

      {value && onClear && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute right-3.5 p-1 rounded-full text-[#737373] hover:text-[#111111] hover:bg-neutral-200/50 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};
