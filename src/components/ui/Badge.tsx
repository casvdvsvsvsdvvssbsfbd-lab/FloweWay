import React from 'react';

export interface BadgeProps {
  variant?: 'discount' | 'new' | 'popular' | 'stock' | 'neutral' | 'success';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
}) => {
  const base = 'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md tracking-tight whitespace-nowrap';

  const variants = {
    discount: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    new: 'bg-emerald-50 text-emerald-800 border border-emerald-200/70',
    popular: 'bg-amber-50 text-amber-900 border border-amber-200/60',
    stock: 'bg-neutral-100 text-[#555555]',
    neutral: 'bg-[#f4f4f3] text-[#444444]',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
  };

  return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>;
};
