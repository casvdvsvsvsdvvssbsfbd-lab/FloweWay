import React from 'react';
import { Home, LayoutGrid, Search, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, switchTab, currentView, navigate, favoriteIds } = useApp();

  const isHome = currentView.type === 'tab' && activeTab === 'home';
  const isCatalog = currentView.type === 'tab' && activeTab === 'catalog';
  const isSearch = currentView.type === 'tab' && activeTab === 'search';
  const isWishlist = currentView.type === 'favorites';
  const isProfile = currentView.type === 'tab' && activeTab === 'profile';

  return (
    <div className="md:hidden fixed bottom-safe left-2 right-2 sm:left-4 sm:right-4 z-40 flex justify-center pointer-events-none">
      <nav
        id="mobile-bottom-nav"
        className="pointer-events-auto max-w-md w-full glass-dock rounded-full p-1 sm:p-1.5 flex items-center justify-between transition-all duration-300 shadow-xl"
      >
        {/* Home */}
        <motion.button
          id="nav-tab-home"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            switchTab('home');
            navigate({ type: 'tab', tab: 'home' });
          }}
          className={`flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isHome
              ? 'bg-gradient-to-r from-[#1c3829] to-[#294e3b] text-white px-3.5 py-2 rounded-full shadow-[0_4px_14px_rgba(28,56,41,0.35)] border border-white/20'
              : 'text-stone-600 hover:text-stone-950 p-2 rounded-full'
          }`}
          aria-label="Asosiy"
        >
          <Home className={`w-4.5 h-4.5 ${isHome ? 'stroke-[2.4]' : 'stroke-[1.9]'}`} />
          {isHome && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="text-[11px] font-bold tracking-tight ml-1.5 font-serif whitespace-nowrap"
            >
              Asosiy
            </motion.span>
          )}
        </motion.button>

        {/* Categories */}
        <motion.button
          id="nav-tab-categories"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            switchTab('catalog');
            navigate({ type: 'tab', tab: 'catalog' });
          }}
          className={`flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isCatalog
              ? 'bg-gradient-to-r from-[#1c3829] to-[#294e3b] text-white px-3.5 py-2 rounded-full shadow-[0_4px_14px_rgba(28,56,41,0.35)] border border-white/20'
              : 'text-stone-600 hover:text-stone-950 p-2 rounded-full'
          }`}
          aria-label="Katalog"
        >
          <LayoutGrid className={`w-4.5 h-4.5 ${isCatalog ? 'stroke-[2.4]' : 'stroke-[1.9]'}`} />
          {isCatalog && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="text-[11px] font-bold tracking-tight ml-1.5 font-serif whitespace-nowrap"
            >
              Katalog
            </motion.span>
          )}
        </motion.button>

        {/* Search */}
        <motion.button
          id="nav-tab-search"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            switchTab('search');
            navigate({ type: 'tab', tab: 'search' });
          }}
          className={`flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isSearch
              ? 'bg-gradient-to-r from-[#1c3829] to-[#294e3b] text-white px-3.5 py-2 rounded-full shadow-[0_4px_14px_rgba(28,56,41,0.35)] border border-white/20'
              : 'text-stone-600 hover:text-stone-950 p-2 rounded-full'
          }`}
          aria-label="Qidiruv"
        >
          <Search className={`w-4.5 h-4.5 ${isSearch ? 'stroke-[2.4]' : 'stroke-[1.9]'}`} />
          {isSearch && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="text-[11px] font-bold tracking-tight ml-1.5 font-serif whitespace-nowrap"
            >
              Qidiruv
            </motion.span>
          )}
        </motion.button>

        {/* Wishlist */}
        <motion.button
          id="nav-tab-wishlist"
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate({ type: 'favorites' })}
          className={`flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
            isWishlist
              ? 'bg-gradient-to-r from-[#b85d3f] to-[#96472f] text-white px-3.5 py-2 rounded-full shadow-[0_4px_14px_rgba(184,93,63,0.35)] border border-white/20'
              : 'text-stone-600 hover:text-stone-950 p-2 rounded-full'
          }`}
          aria-label="Saralangan"
        >
          <div className="relative">
            <Heart
              className={`w-4.5 h-4.5 ${
                isWishlist ? 'stroke-[2.4] fill-white text-white' : 'stroke-[1.9]'
              }`}
            />
            {favoriteIds.length > 0 && !isWishlist && (
              <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 bg-[#b85d3f] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {favoriteIds.length}
              </span>
            )}
          </div>
          {isWishlist && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="text-[11px] font-bold tracking-tight ml-1.5 font-serif whitespace-nowrap"
            >
              Sevimlilar
            </motion.span>
          )}
        </motion.button>

        {/* Profile */}
        <motion.button
          id="nav-tab-profile"
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            switchTab('profile');
            navigate({ type: 'tab', tab: 'profile' });
          }}
          className={`flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isProfile
              ? 'bg-gradient-to-r from-[#1c3829] to-[#294e3b] text-white px-3.5 py-2 rounded-full shadow-[0_4px_14px_rgba(28,56,41,0.35)] border border-white/20'
              : 'text-stone-600 hover:text-stone-950 p-2 rounded-full'
          }`}
          aria-label="Profil"
        >
          <User className={`w-4.5 h-4.5 ${isProfile ? 'stroke-[2.4]' : 'stroke-[1.9]'}`} />
          {isProfile && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              className="text-[11px] font-bold tracking-tight ml-1.5 font-serif whitespace-nowrap"
            >
              Profil
            </motion.span>
          )}
        </motion.button>
      </nav>
    </div>
  );
};
