import React, { useState } from 'react';
import { Leaf } from 'lucide-react';

interface IOSSmoothImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  hoverScale?: boolean;
  priority?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: () => void;
}

/**
 * High-Performance Hardware-Accelerated Image Component
 * Eliminates layout shifts, uses GPU translation without expensive filter blurs.
 */
export const IOSSmoothImage: React.FC<IOSSmoothImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  loading = 'lazy',
  hoverScale = true,
  priority = false,
  referrerPolicy = 'no-referrer',
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full overflow-hidden bg-[#f7f5f0] ${containerClassName}`}
      style={{
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {/* 1. Shimmer Skeleton Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#f0eae1] animate-pulse flex items-center justify-center pointer-events-none">
          <Leaf className="w-6 h-6 text-stone-300 stroke-[1.5]" />
        </div>
      )}

      {/* 2. Error Fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f7f5f0] text-[#8c8c8c] p-4 text-center">
          <Leaf className="w-8 h-8 stroke-[1.5] text-stone-300 mb-1" />
          <span className="text-[10px] font-medium tracking-tight">Rasm yuklanmadi</span>
        </div>
      ) : (
        /* 3. GPU-Accelerated Crisp Image */
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-300 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
          } ${
            hoverScale ? 'group-hover:scale-[1.03] group-hover:duration-300' : ''
          } ${className}`}
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        />
      )}
    </div>
  );
};
