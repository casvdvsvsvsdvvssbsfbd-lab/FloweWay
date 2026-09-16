import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

export const AppDownloadBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      id="app-download-banner"
      className="w-full h-11 bg-emerald-50/90 border-b border-emerald-200/60 text-emerald-950 flex items-center justify-between px-3 sm:px-6 select-none relative z-50 transition-all backdrop-blur-md"
    >
      <div className="flex-1 flex items-center justify-center gap-3">
        {/* App Icon (24px rounded) */}
        <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
          <span className="text-white font-black text-xs tracking-tighter">s<span className="text-emerald-200">.</span></span>
        </div>

        {/* Text Details */}
        <div className="flex items-center gap-2 text-center">
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-emerald-950">
            Plant Market ilovasini yuklab oling
          </span>
          <span className="hidden sm:inline text-emerald-400 text-xs">·</span>
          <span className="text-[11px] text-emerald-700 tracking-tight font-medium hidden sm:inline">
            iOS va Android uchun
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-700 stroke-[2.2] ml-0.5" />
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100/70 p-1 rounded-full transition-colors cursor-pointer"
        aria-label="Yopish"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
