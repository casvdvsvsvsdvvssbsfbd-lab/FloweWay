import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className = '',
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value < max) {
      onChange(value + 1);
    }
  };

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-center border border-[#e0e0df] rounded-full bg-white ${
        isSmall ? 'px-2 py-0.5' : 'px-3 py-1'
      } ${className}`}
      onClick={e => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="p-1 text-[#737373] hover:text-[#111111] disabled:opacity-30 disabled:hover:text-[#737373] cursor-pointer transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>

      <span
        className={`text-center font-bold text-[#111111] select-none ${
          isSmall ? 'w-6 text-xs' : 'w-8 text-sm'
        }`}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="p-1 text-[#737373] hover:text-[#111111] disabled:opacity-30 disabled:hover:text-[#737373] cursor-pointer transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>
    </div>
  );
};
