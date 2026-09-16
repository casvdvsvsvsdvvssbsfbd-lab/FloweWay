import React, { useState, useEffect } from 'react';

export const FlashSaleCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono">
      <span className="text-stone-300 font-serif">Tugashiga qoldi:</span>
      <div className="flex items-center gap-1">
        <span className="px-2 py-1 bg-black/40 rounded-md font-bold text-[#dfb15b] border border-white/20">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="px-2 py-1 bg-black/40 rounded-md font-bold text-[#dfb15b] border border-white/20">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span>:</span>
        <span className="px-2 py-1 bg-black/40 rounded-md font-bold text-[#dfb15b] border border-white/20">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
