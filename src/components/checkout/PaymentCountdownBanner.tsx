import React, { useEffect, useState, useRef } from 'react';
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentCountdownBannerProps {
  initialSeconds?: number; // default 420 (7 minutes)
  onExpire: () => void;
  onExtend?: () => void;
  className?: string;
}

export const PaymentCountdownBanner: React.FC<PaymentCountdownBannerProps> = ({
  initialSeconds = 420, // 7 minutes
  onExpire,
  onExtend,
  className = '',
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    // Reset if initialSeconds changes
    setSecondsLeft(initialSeconds);
    setIsExpired(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsExpired(true);
      const closeTimer = setTimeout(() => {
        onExpireRef.current();
      }, 3000);
      return () => clearTimeout(closeTimer);
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const percentLeft = Math.max(0, Math.min(100, (secondsLeft / initialSeconds) * 100));

  const isUrgent = secondsLeft < 120 && secondsLeft > 0;

  const handleManualExtend = () => {
    setSecondsLeft(420);
    setIsExpired(false);
    if (onExtend) onExtend();
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
        isExpired
          ? 'bg-rose-50 border-rose-300 text-rose-950'
          : isUrgent
          ? 'bg-amber-50/90 border-amber-300/80 text-amber-950'
          : 'bg-[#faf7f2] border-[#e6ded2] text-[#292524]'
      } ${className}`}
    >
      <div className="p-3 sm:p-3.5 space-y-2.5">
        {/* Top Header Strip with Live Timer */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 ${
                isExpired
                  ? 'bg-rose-600 text-white'
                  : isUrgent
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-[#1c3829] text-[#dfb15b]'
              }`}
            >
              {isExpired ? (
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Clock className="w-4 h-4 stroke-[2.2]" />
              )}
            </div>

            <div className="min-w-0">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-stone-500 font-sans block leading-tight">
                {isExpired ? "Sessiya Yakunlandi" : "To'lov Sessiyasi Vaqti"}
              </span>
              <span className="text-xs sm:text-[13px] font-bold tracking-tight text-stone-900 font-sans block truncate">
                {isExpired
                  ? "7 daqiqalik to'lov vaqti tugadi!"
                  : "Rekvizitlar 7 daqiqa faol"}
              </span>
            </div>
          </div>

          {/* Big Digital Countdown Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`px-3 py-1 rounded-xl font-mono text-sm sm:text-base font-extrabold tracking-wider border shadow-xs flex items-center gap-1.5 ${
                isExpired
                  ? 'bg-rose-100 border-rose-300 text-rose-700'
                  : isUrgent
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-white border-[#dfd6c5] text-[#1c3829]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isExpired
                    ? 'bg-rose-600'
                    : isUrgent
                    ? 'bg-white animate-ping'
                    : 'bg-emerald-600 animate-pulse'
                }`}
              />
              <span>{formattedTime}</span>
            </div>

            {/* Refresh / Extend Time button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={handleManualExtend}
              title="Vaqtni yangilash (7 daqiqa)"
              className="p-1.5 rounded-lg border border-stone-300 hover:border-stone-400 bg-white text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Informative Warning Notification Text */}
        <p className="text-[11px] sm:text-xs leading-relaxed text-stone-600 font-sans border-t border-stone-200/60 pt-2">
          {isExpired ? (
            <span className="text-rose-700 font-bold">
              ⚠️ Xavfsizlik maqsadida buyurtma bekor qilindi va to'lov sahifasi 3 soniyada avtomatik yopiladi...
            </span>
          ) : (
            <>
              <strong className="text-[#1c3829] font-bold">Diqqat:</strong> Ushbu to'lov sessiyasi va rasmiy rekvizitlar xavfsizlik nuqtai nazaridan{' '}
              <strong className="text-amber-800 font-bold">7 daqiqa</strong> davomida faol. Agar 7 daqiqa ichida to'lov qilinmasa yoki chek yuklanmasa, sahifa avtomatik yopiladi va buyurtma bekor qilinadi.
            </>
          )}
        </p>

        {/* Smooth Countdown Progress Bar */}
        <div className="w-full h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              isExpired
                ? 'bg-rose-600'
                : isUrgent
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-amber-500 to-emerald-600'
            }`}
            style={{ width: `${percentLeft}%` }}
          />
        </div>
      </div>
    </div>
  );
};
