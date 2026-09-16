import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ArrowLeft,
  Sprout,
  X,
  BookOpen,
  Bell,
  PlusCircle,
  Truck,
  ShieldCheck,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    canGoBack,
    goBack,
    navigate,
    currentView,
    cartTotalCount,
    cartTotalAmount,
    favoriteIds,
    unreadNotifCount,
    openCategory,
    setIsAddProductModalOpen,
  } = useApp();

  const [headerSearchInput, setHeaderSearchInput] = useState('');
  const [promoIndex, setPromoIndex] = useState(0);

  const promos = [
    { icon: Truck, text: "🌿 Plant Market • 250,000 so'mdan yuqori xaridlarga O'zbekiston bo'ylab BEPUL yetkazib berish" },
    { icon: Zap, text: "⚡️ Sara Xona Gullari va Sopol Tuvaklar — Toshkentda 3 soatda yetkaziladi" },
    { icon: ShieldCheck, text: "🪴 14 kunlik sog'lomlik kafolati & O'simlik shifokori bepul konsultatsiyasi" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex(prev => (prev + 1) % promos.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [promos.length]);

  const isHome = currentView.type === 'tab' && currentView.tab === 'home';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchInput.trim()) {
      navigate({ type: 'tab', tab: 'search' });
    }
  };

  const navCategories = [
    { label: "🌿 Xona Gullari", category: 'live-plants' as const },
    { label: '🪴 Sopol & Terrakota Tuvaklar', category: 'pots-planters' as const },
    { label: '🪨 Tuproq & Substratlar', category: 'soil-substrates' as const },
    { label: '💊 Dori & Fitoterapiya', category: 'plant-medicine' as const },
    { label: '🧪 O‘g‘it & Bio-Oziq', category: 'fertilizers' as const },
    { label: '💐 Yangi Guldastalar', category: 'bouquets' as const },
    { label: '🌸 Premium Orxideyalar', category: 'orchids' as const },
    { label: '✂️ Bog‘ Asboblari', category: 'gardening-accessories' as const },
  ];

  const CurrentPromoIcon = promos[promoIndex].icon;

  return (
    <div className="w-full sticky top-0 z-40 bg-[#faf7f2] shadow-xs">
      {/* 1. Botanical Announcement Bar with Smooth Transition */}
      <div className="w-full bg-[#1c3829] text-white text-[11px] font-medium py-1.5 px-3 border-b border-[#294e3b]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-center sm:text-left h-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={promoIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2"
              >
                <CurrentPromoIcon className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span className="truncate text-stone-200 tracking-tight font-serif">
                  {promos[promoIndex].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-stone-300 text-[11px] shrink-0">
            <button
              onClick={() => navigate({ type: 'plant_care_guide' })}
              className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-1 font-serif"
            >
              <BookOpen className="w-3 h-3 text-[#d4af37]" />
              <span>Gullar Shifokori • Bepul Maslahat</span>
            </button>
            <span className="text-[#3c5e4b]">•</span>
            <span className="text-stone-300 font-mono">Toshkent: +998 71 200-44-88</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header with Crystal Frosted Glass */}
      <header
        id="main-ecommerce-header"
        className="w-full glass-header transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 h-15 sm:h-17 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Left section: Logo & optional Back button */}
          <div className="flex items-center gap-2 shrink-0">
            {!isHome && canGoBack && (
              <motion.button
                id="header-back-btn"
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                onClick={goBack}
                className="w-9 h-9 rounded-full glass-pill hover:bg-white text-stone-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                aria-label="Orqaga"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
              </motion.button>
            )}

            {/* Plant Market Logo */}
            <motion.button
              id="header-brand-logo"
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate({ type: 'tab', tab: 'home' })}
              className="flex items-center gap-2.5 group cursor-pointer text-left select-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#1c3829] via-[#284c37] to-[#b85d3f] text-white flex items-center justify-center shrink-0 shadow-md border border-white/40 ring-1 ring-[#dfb15b]/30 group-hover:shadow-lg transition-all">
                <Sprout className="w-5 h-5 stroke-[2] text-[#fff6d6]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-xl font-bold tracking-tight text-[#1c1917] font-display leading-tight">
                    Plant<span className="text-[#b85d3f]">Market</span>
                  </span>
                  <span className="hidden min-[480px]:inline-block px-1.5 py-0.2 bg-[#fdf6e7]/90 backdrop-blur-xs text-[#926d1d] border border-[#ebd9a9] font-bold text-[9px] rounded-md font-serif tracking-wider shadow-2xs">
                    Rasmiy
                  </span>
                </div>
                <span className="text-[10px] text-[#78716c] font-serif hidden sm:block leading-none">
                  O'simliklar & Bog'dorchilik Bozori
                </span>
              </div>
            </motion.button>
          </div>

          {/* Center: Search Bar with Translucent Glass Capsule */}
          <div className="hidden md:flex flex-1 max-w-lg lg:max-w-xl mx-2">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative flex items-center"
              onClick={() => {
                if (currentView.type !== 'tab' || currentView.tab !== 'search') {
                  navigate({ type: 'tab', tab: 'search' });
                }
              }}
            >
              <Search className="w-4 h-4 text-[#8c857b] absolute left-3.5 pointer-events-none stroke-[2.2]" />
              <input
                type="text"
                value={headerSearchInput}
                onChange={e => setHeaderSearchInput(e.target.value)}
                placeholder="Terrakota, sopol tuvak, tuproq, o'g'it, dori, orxideya..."
                className="w-full h-10.5 pl-10 pr-24 bg-white/75 backdrop-blur-md border border-[#e7e0d3] hover:border-[#b85d3f]/60 focus:border-[#1c3829] focus:bg-white rounded-full text-xs sm:text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-hidden transition-all shadow-2xs"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-1.5 px-3.5 py-1.5 bg-[#1c3829] hover:bg-[#284c37] text-white rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 font-serif"
              >
                <span>Qidirish</span>
              </motion.button>
              {headerSearchInput && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setHeaderSearchInput('');
                  }}
                  className="absolute right-22 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons in Frosted Glass */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Sell Product / Add Listing Button with Glass Terracotta */}
            <motion.button
              id="header-sell-product-btn"
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddProductModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#b85d3f] to-[#96472f] hover:from-[#96472f] hover:to-[#7f3923] text-white text-xs font-bold shadow-xs transition-all cursor-pointer border border-white/25"
              title="Mahsulotni sotuvga qo'yish"
            >
              <PlusCircle className="w-4 h-4 text-[#ffe6dd]" />
              <span className="hidden min-[480px]:inline font-serif">Sotuvga qo‘yish</span>
              <span className="min-[480px]:hidden font-serif">Sotish</span>
            </motion.button>

            {/* Mobile Search Button */}
            <motion.button
              id="mobile-search-trigger-btn"
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate({ type: 'tab', tab: 'search' })}
              className="md:hidden w-9 h-9 rounded-xl text-stone-800 hover:bg-white/90 flex items-center justify-center transition-all cursor-pointer border border-[#e7e0d3] glass-pill shadow-2xs"
              aria-label="Qidirish"
              title="Qidirish"
            >
              <Search className="w-4.5 h-4.5 stroke-[2]" />
            </motion.button>

            {/* Notification Button */}
            <motion.button
              id="header-notifications-btn"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate({ type: 'notifications' })}
              className="w-9 h-9 rounded-xl glass-pill text-stone-800 hover:bg-white flex items-center justify-center transition-all relative cursor-pointer shadow-2xs"
              aria-label="Bildirishnomalar"
              title="Bildirishnomalar"
            >
              <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
              {unreadNotifCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#b85d3f] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs font-mono leading-none"
                >
                  {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
                </motion.span>
              )}
            </motion.button>

            {/* Wishlist (Desktop) */}
            <motion.button
              id="header-wishlist-btn"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate({ type: 'favorites' })}
              className="hidden sm:flex w-9 h-9 rounded-xl text-stone-800 hover:bg-white glass-pill items-center justify-center transition-all relative cursor-pointer shadow-2xs"
              aria-label="Saralanganlar"
              title="Saralanganlar"
            >
              <Heart
                className={`w-4.5 h-4.5 stroke-[1.8] ${
                  favoriteIds.length > 0 ? 'fill-[#b85d3f] text-[#b85d3f]' : ''
                }`}
              />
              {favoriteIds.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#b85d3f] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs font-mono leading-none"
                >
                  {favoriteIds.length > 99 ? '99+' : favoriteIds.length}
                </motion.span>
              )}
            </motion.button>

            {/* Cart with Live Price & Count Pill */}
            <motion.button
              id="header-cart-btn"
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => navigate({ type: 'tab', tab: 'cart' })}
              className="h-9 px-3.5 sm:px-4 bg-[#1c3829] hover:bg-[#284c37] text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs border border-white/20"
              aria-label="Savat"
              title="Savat"
            >
              <ShoppingBag className="w-4 h-4 text-[#dfb15b] stroke-[2.2]" />
              <span className="text-xs font-bold font-mono tracking-tight">{cartTotalCount}</span>
              {cartTotalAmount > 0 && (
                <span className="hidden lg:inline-block text-[11px] text-stone-200 font-bold border-l border-emerald-900/60 pl-2 font-mono">
                  {cartTotalAmount.toLocaleString('uz-UZ')} so'm
                </span>
              )}
            </motion.button>

            {/* Account */}
            <motion.button
              id="header-profile-btn"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate({ type: 'tab', tab: 'profile' })}
              className="hidden sm:flex w-9 h-9 rounded-xl text-stone-800 hover:bg-white glass-pill items-center justify-center transition-all cursor-pointer shadow-2xs"
              aria-label="Profil"
              title="Profil"
            >
              <User className="w-4.5 h-4.5 stroke-[1.8]" />
            </motion.button>
          </div>
        </div>

        {/* 3. Category Bar */}
        <div className="hidden lg:block border-t border-[#e7e0d3]/80 bg-[#f4efe6]/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs font-semibold text-stone-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate({ type: 'tab', tab: 'catalog' })}
                className="px-3 py-1.5 bg-[#1c3829] text-white rounded-lg hover:bg-[#284c37] transition-colors flex items-center gap-1.5 font-bold cursor-pointer mr-2 shadow-2xs font-serif"
              >
                <span>Barcha Bo'limlar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>

              {navCategories.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => openCategory(cat.category)}
                  className="px-3 py-1 hover:text-[#1c3829] hover:bg-white/80 rounded-lg transition-all cursor-pointer whitespace-nowrap text-stone-700 font-serif"
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#b85d3f] bg-[#fdf3ef]/80 backdrop-blur-xs px-3 py-1 rounded-lg border border-[#f5d9cf]">
              <span className="w-2 h-2 rounded-full bg-[#b85d3f] animate-ping"></span>
              <span className="font-serif italic font-semibold">Bahorgi Chegirmalar -30%</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};


