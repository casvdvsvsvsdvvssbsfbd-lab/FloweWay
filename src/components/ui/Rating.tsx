import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  showNumber = true,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-1 ${textClass} text-[#737373] ${className}`}>
      <div className="flex items-center text-amber-500">
        <Star className={`${iconSize} fill-amber-400 stroke-amber-400`} />
      </div>

      {showNumber && (
        <span className="font-semibold text-[#111111]">{rating.toFixed(1)}</span>
      )}

      {reviewCount !== undefined && (
        <span className="text-[#8c8c8c] text-[11px]">({reviewCount})</span>
      )}
    </div>
  );
};
