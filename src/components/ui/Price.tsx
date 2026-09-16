import React from 'react';
import { formatUZS } from '../../utils/formatters';

export interface PriceProps {
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Price: React.FC<PriceProps> = ({
  price,
  oldPrice,
  discountPercent,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: {
      current: 'text-sm font-bold',
      old: 'text-[11px]',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
      current: 'text-base sm:text-[17px] font-bold',
      old: 'text-xs',
      badge: 'text-[11px] px-1.5 py-0.5',
    },
    lg: {
      current: 'text-xl sm:text-2xl font-bold',
      old: 'text-sm',
      badge: 'text-xs px-2 py-0.5',
    },
    xl: {
      current: 'text-2xl sm:text-3xl font-black',
      old: 'text-base',
      badge: 'text-xs px-2 py-0.5',
    },
  };

  const currentStyles = sizeMap[size];
  const hasDiscount = Boolean(oldPrice && oldPrice > price);
  const calculatedDiscount =
    discountPercent || (hasDiscount && oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0);

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`${currentStyles.current} text-[#111111] tracking-tight`}>
        {formatUZS(price)}
      </span>

      {hasDiscount && oldPrice && (
        <span className={`${currentStyles.old} text-[#8c8c8c] line-through font-normal`}>
          {formatUZS(oldPrice)}
        </span>
      )}

      {calculatedDiscount > 0 && (
        <span className={`${currentStyles.badge} rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 font-bold tracking-tight`}>
          -{calculatedDiscount}%
        </span>
      )}
    </div>
  );
};
