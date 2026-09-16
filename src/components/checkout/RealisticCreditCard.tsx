import React from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RealisticCreditCardProps {
  variant: 'business' | 'user';
  cardNumber: string;
  cardHolder: string;
  bankName?: string;
  expiry?: string;
  inn?: string;
  cardBrandName?: string; // 'UZCARD' | 'HUMO' | 'VISA' | 'Mastercard' | 'UZCARD BUSINESS'
  onCopy?: () => void;
  isCopied?: boolean;
  accentAmount?: string;
  subTitle?: string;
}

export const RealisticCreditCard: React.FC<RealisticCreditCardProps> = ({
  variant,
  cardNumber,
  cardHolder,
  bankName = "AGROBANK ATB",
  expiry = "12/28",
  inn,
  cardBrandName,
  onCopy,
  isCopied = false,
  accentAmount,
  subTitle,
}) => {
  const isBusiness = variant === 'business';

  // Format card number nicely into 4-digit chunks
  const cleanDigits = cardNumber.replace(/\s/g, '');
  const formattedDigits = cleanDigits.padEnd(16, '•').replace(/(\w{4})(?=\w)/g, '$1 ');

  // Determine brand styling and logos
  const brand = (cardBrandName || (cleanDigits.startsWith('9860') ? 'HUMO' : cleanDigits.startsWith('4') ? 'VISA' : cleanDigits.startsWith('5') ? 'Mastercard' : isBusiness ? 'UZCARD BUSINESS' : 'UZCARD')).toUpperCase();

  return (
    <div className="w-full max-w-[390px] sm:max-w-[420px] mx-auto select-none">
      {/* Physical Card Container with true ISO/IEC 7810 ID-1 standard aspect ratio (1.586 : 1) */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className={`relative w-full aspect-[1.586/1] rounded-[20px] sm:rounded-[22px] p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-[0_18px_40px_-12px_rgba(20,24,22,0.38)] border transition-all duration-300 ${
          isBusiness
            ? 'bg-gradient-to-br from-[#0e2c20] via-[#143d2d] to-[#0a2319] text-[#f7f5f0] border-[#c59838]/40 ring-1 ring-[#c59838]/25'
            : brand.includes('HUMO')
            ? 'bg-gradient-to-br from-[#123628] via-[#1a4a37] to-[#0c261c] text-[#f7f5f0] border-[#366850]/50'
            : brand.includes('VISA')
            ? 'bg-gradient-to-br from-[#0f1f3d] via-[#162f59] to-[#0a1529] text-white border-blue-400/30'
            : 'bg-gradient-to-br from-[#1a1918] via-[#242322] to-[#121110] text-stone-100 border-stone-700/60'
        }`}
      >
        {/* Subtle Italian Satin Sheen & Diagonal Refraction */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/12 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br from-[#dfb15b]/20 via-white/5 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

        {/* Micro Florentine / Italian Guilloche Geometric Watermark */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="card-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 0 12 Q 6 0, 12 12 T 24 12" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-pattern)" />
        </svg>

        {/* Card Top Row: Bank Header & Payment Network Brand */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isBusiness ? (
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-[#dfb15b] to-[#a37920] p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-[6px] bg-[#0e2c20] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
                </div>
              </div>
            ) : (
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
            )}
            <div>
              <div className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[#f5eed9] font-sans uppercase">
                {bankName}
              </div>
              <div className="text-[8px] sm:text-[9px] tracking-wider text-[#dfb15b] font-sans uppercase">
                {subTitle || (isBusiness ? "Rasmiy Korporativ Hisob" : "Mijoz Debet Kartasi")}
              </div>
            </div>
          </div>

          {/* Brand Logo / Badge */}
          <div className="flex items-center gap-1.5">
            {isBusiness ? (
              <div className="px-2.5 py-0.5 rounded-md bg-[#c59838]/20 border border-[#c59838]/50 backdrop-blur-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#dfb15b] animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-[#fbf6ea] font-mono">
                  UZCARD BUSINESS
                </span>
              </div>
            ) : brand.includes('HUMO') ? (
              <div className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-black tracking-wider text-emerald-200">
                HUMO
              </div>
            ) : brand.includes('VISA') ? (
              <span className="text-xs sm:text-sm font-black tracking-wider italic text-white drop-shadow-sm font-sans">
                VISA
              </span>
            ) : brand.includes('MASTERCARD') ? (
              <div className="flex items-center -space-x-1.5">
                <div className="w-4 h-4 rounded-full bg-red-500/90 shadow-xs" />
                <div className="w-4 h-4 rounded-full bg-amber-400/90 shadow-xs" />
              </div>
            ) : (
              <div className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/40 text-[10px] font-black tracking-wider text-blue-200">
                UZCARD
              </div>
            )}
          </div>
        </div>

        {/* Card Middle Row: Realistic Gold EMV Chip & Contactless NFC Waves */}
        <div className="relative z-10 flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            {/* Authentic Gold Plated EMV Microchip */}
            <div className="w-10 h-7 sm:w-11 sm:h-8 rounded-[6px] bg-gradient-to-tr from-[#c89830] via-[#f7e49c] to-[#aa8014] p-0.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.3)] relative overflow-hidden">
              <div className="w-full h-full rounded-[4px] border border-[#7a5c10]/40 relative grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5 bg-gradient-to-b from-[#dfb15b] to-[#b3851b]">
                <div className="col-span-1 border-r border-[#694f0e]/30" />
                <div className="col-span-1 border-r border-[#694f0e]/30 rounded-xs bg-[#fceec5]/30" />
                <div className="col-span-1" />
                <div className="col-span-3 border-t border-b border-[#694f0e]/30" />
                <div className="col-span-1 border-r border-[#694f0e]/30" />
                <div className="col-span-1 border-r border-[#694f0e]/30" />
                <div className="col-span-1" />
              </div>
            </div>

            {/* Contactless Wave Icon (4 concentric arcs) */}
            <svg
              className="w-5 h-5 text-[#dfb15b]/80 stroke-current rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M5 12.5a8.5 8.5 0 0 1 14 0" />
              <path d="M8 14a5 5 0 0 1 8 0" />
              <path d="M10.5 15.5a2 2 0 0 1 3 0" />
            </svg>
          </div>

          {/* Quick Copy Button on card if requested */}
          {onCopy && (
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={onCopy}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isCopied
                  ? 'bg-emerald-400 text-emerald-950 font-extrabold'
                  : 'bg-[#faf8f5]/90 hover:bg-[#faf8f5] text-[#1a1918] border border-white/40'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-800" />
                  <span>Nusxalandi</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-700" />
                  <span>Nusxa olish</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Card Number Row: Letterpress Embossed Typography */}
        <div className="relative z-10 my-auto py-1">
          <div className="font-mono text-base sm:text-[19px] tracking-[0.20em] sm:tracking-[0.24em] font-extrabold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] flex items-center justify-between">
            <span>{formattedDigits}</span>
          </div>
        </div>

        {/* Card Bottom Row: Cardholder, Expiry, INN / Amount */}
        <div className="relative z-10 flex items-end justify-between pt-1 border-t border-white/12 text-white/90">
          <div className="min-w-0 pr-2">
            <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#dfb15b]/80 font-sans font-semibold">
              Karta Egasi
            </div>
            <div className="font-bold text-xs sm:text-[13px] tracking-wider uppercase truncate text-[#fffdfa] font-sans drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
              {cardHolder || 'FLOWERWAY LLC'}
            </div>
          </div>

          <div className="flex items-end gap-3 sm:gap-4 shrink-0">
            {inn && (
              <div className="text-right">
                <div className="text-[8px] uppercase tracking-widest text-stone-400 font-sans">
                  INN
                </div>
                <div className="font-mono text-[10px] sm:text-[11px] font-bold text-stone-200">
                  {inn}
                </div>
              </div>
            )}

            <div className="text-right">
              <div className="text-[8px] uppercase tracking-widest text-[#dfb15b]/80 font-sans">
                Amal Qilish
              </div>
              <div className="font-mono text-[11px] sm:text-xs font-bold text-stone-100">
                {expiry}
              </div>
            </div>

            {/* Iridescent Hologram Sticker */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-400 to-amber-300 opacity-80 shadow-xs border border-white/40 ring-1 ring-white/20" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
