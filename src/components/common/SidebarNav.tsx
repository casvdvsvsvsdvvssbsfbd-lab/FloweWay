import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Tag, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SidebarNav: React.FC = () => {
  const { activeTab, switchTab, currentView, navigate, cartTotalCount, favoriteIds } = useApp();

  const isHome = currentView.type === 'tab' && activeTab === 'home';
  const isCatalog = currentView.type === 'tab' && activeTab === 'catalog';
  const isCart = currentView.type === 'tab' && activeTab === 'cart';
  const isFavorites = currentView.type === 'favorites';

  return (
    <aside
      id="shop-sidebar-nav-rail"
      className="hidden md:flex flex-col items-center justify-between w-16 shrink-0 bg-white py-6 select-none sticky top-0 h-screen border-r border-[#ebebeb] z-40"
    >
      {/* Navigation Icons Stack */}
      <nav className="flex flex-col items-center gap-4 w-full pt-2">
        {/* 1. Home Icon (Solid filled black when active, matching image.png) */}
        <button
          id="sidebar-nav-home"
          onClick={() => {
            switchTab('home');
            navigate({ type: 'tab', tab: 'home' });
          }}
          title="Home"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isHome ? 'text-black' : 'text-[#787574] hover:text-black hover:bg-[#f2f4f5]'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'fill-black text-black' : 'stroke-[2]'}`} />
        </button>

        {/* 2. Grid / Categories Icon */}
        <button
          id="sidebar-nav-catalog"
          onClick={() => switchTab('catalog')}
          title="Browse Categories"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isCatalog ? 'bg-[#f2f4f5] text-black font-semibold' : 'text-[#787574] hover:text-black hover:bg-[#f2f4f5]'
          }`}
        >
          <LayoutGrid className="w-5 h-5 stroke-[2]" />
        </button>

        {/* 3. Shop Violet Cart Circle Button (Exact highlight from image.png) */}
        <button
          id="sidebar-nav-cart"
          onClick={() => switchTab('cart')}
          title="Cart"
          className="w-11 h-11 rounded-full bg-[#5433eb] text-white flex items-center justify-center relative shadow-[0_2px_8px_rgba(84,51,235,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer my-1"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          {/* Badge indicator matching image.png */}
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-white text-[#5433eb] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#5433eb] shadow-xs">
            {cartTotalCount > 0 ? cartTotalCount : 1}
          </span>
        </button>

        {/* 4. Deals / Tag Icon */}
        <button
          id="sidebar-nav-deals"
          onClick={() => {
            navigate({ type: 'category', category: 'bundles' });
          }}
          title="Deals & Discounts"
          className="w-11 h-11 rounded-full flex items-center justify-center text-[#787574] hover:text-black hover:bg-[#f2f4f5] transition-all duration-200 cursor-pointer"
        >
          <Tag className="w-5 h-5 stroke-[2]" />
        </button>

        {/* 5. Heart / Favorites Icon */}
        <button
          id="sidebar-nav-favorites"
          onClick={() => navigate({ type: 'favorites' })}
          title="Favorites"
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 relative cursor-pointer ${
            isFavorites ? 'bg-[#f2f4f5] text-black' : 'text-[#787574] hover:text-black hover:bg-[#f2f4f5]'
          }`}
        >
          <Heart className={`w-5 h-5 stroke-[2] ${favoriteIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
          {favoriteIds.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </button>
      </nav>

      {/* Bottom Section: Circular Avatar with soft violet background 'C' (exact match from image.png) */}
      <div className="w-full flex justify-center pb-2">
        <button
          id="sidebar-profile-btn"
          onClick={() => switchTab('profile')}
          title="User Profile (C)"
          className="w-9 h-9 rounded-full bg-[#c0b5f3] flex items-center justify-center text-white font-bold text-sm select-none shadow-xs hover:opacity-90 transition-opacity cursor-pointer ring-2 ring-white"
        >
          C
        </button>
      </div>
    </aside>
  );
};
