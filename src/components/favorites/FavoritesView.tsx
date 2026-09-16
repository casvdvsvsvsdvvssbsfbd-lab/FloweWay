import React, { useState } from 'react';
import { Heart, ShoppingBag, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';

export const FavoritesView: React.FC = () => {
  const { favoriteProducts, goBack, navigate, addToCart, showToast } = useApp();
  const [selectedCategory] = useState<string>('all');

  const filteredFavorites = favoriteProducts.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleAddAllToCart = () => {
    if (favoriteProducts.length === 0) return;
    favoriteProducts.forEach(product => {
      addToCart(product, 1);
    });
    showToast(`${favoriteProducts.length} ta mahsulot savatga qo'shildi! 🛒`, 'success');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-4">
        <div>
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2 cursor-pointer font-serif"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ortga</span>
          </motion.button>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-display">
            Sevimlilar ({favoriteProducts.length})
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 font-serif">
            Saqlab qo'yilgan xona o'simliklari, gultuvaklar va guldastalar
          </p>
        </div>

        {favoriteProducts.length > 0 && (
          <motion.button
            id="fav-add-all-cart-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddAllToCart}
            className="inline-flex items-center gap-2 bg-[#1c3829] hover:bg-[#284c37] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer font-serif border border-white/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Barchasini savatga qo'shish</span>
          </motion.button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center space-y-4 max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-stone-100 border border-[#e7e0d3] text-stone-900 flex items-center justify-center mx-auto shadow-2xs">
            <Heart className="w-7 h-7 stroke-[1.5] text-stone-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight text-stone-900 font-display">Sevimlilar ro'yxati bo'sh</h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed font-serif">
              O'zingizga yoqqan o'simlik yoki tuvak ustidagi yurakcha belgisini bosib bu yerga saqlang.
            </p>
          </div>
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate({ type: 'tab', tab: 'catalog' })}
              className="px-6 py-3 bg-[#1c3829] hover:bg-[#284c37] text-white font-semibold text-xs rounded-xl shadow-xs transition-transform cursor-pointer font-serif"
            >
              Katalogni ko'rish
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5"
        >
          {filteredFavorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
};
