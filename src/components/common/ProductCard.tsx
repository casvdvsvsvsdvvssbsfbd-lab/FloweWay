import React from 'react';
import { Heart, Plus, Star, ShoppingBag, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatUZS } from '../../utils/formatters';
import { IOSSmoothImage } from './IOSSmoothImage';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  const { openProduct, addToCart, toggleFavorite, isFavorite, showToast } = useApp();
  const favorite = isFavorite(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`"${product.name}" savatga qo'shildi! 🛒`, 'success');
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const hasDiscount = Boolean(product.oldPrice && product.oldPrice > product.price);
  const discountPercent =
    product.discountPercent ||
    (hasDiscount && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0);

  const monthlyPayment = Math.round(product.price / 6);
  const isTerracottaOrPot = product.category === 'pots-planters';

  return (
    <motion.article
      id={`product-card-${product.id}`}
      onClick={() => openProduct(product.id)}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#e7e0d3] hover:border-[#b85d3f]/60 hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer select-none gpu-layer"
    >
      {/* 1. Product Image Container */}
      <div className="relative aspect-square w-full bg-[#fbf9f5] overflow-hidden flex items-center justify-center isolate">
        <IOSSmoothImage
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          hoverScale={true}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 ? (
            <span className="bg-[#b85d3f] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-md tracking-tight font-serif shadow-xs">
              -{discountPercent}% Chegirma
            </span>
          ) : product.isNewArrival ? (
            <span className="bg-[#1c3829] text-[#fff6d6] text-[10px] font-bold px-2 py-0.5 rounded-md tracking-tight font-serif shadow-xs">
              Yangi
            </span>
          ) : isTerracottaOrPot ? (
            <span className="bg-[#8a3a24] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-md tracking-tight font-serif shadow-xs">
              Sopol & Terrakota
            </span>
          ) : null}

          {product.price > 120000 && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-white text-stone-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs border border-stone-200">
              <Zap className="w-2.5 h-2.5 text-[#c59838] fill-[#c59838]" />
              <span>3 soatda</span>
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button
          id={`fav-btn-${product.id}`}
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={handleToggleFav}
          className="absolute top-2.5 right-2.5 w-8.5 h-8.5 rounded-full bg-white text-stone-800 border border-stone-200 flex items-center justify-center transition-all shadow-xs cursor-pointer z-10 hover:shadow-md"
          aria-label={favorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorite ? 'fill-[#b85d3f] text-[#b85d3f]' : 'text-stone-500 stroke-[2]'
            }`}
          />
        </motion.button>

        {/* Hover Quick Add Overlay Button on Desktop */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={handleQuickAdd}
            className="w-full py-2 px-3 rounded-xl bg-[#1c3829] hover:bg-[#284c37] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/25"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#dfb15b]" />
            <span className="font-serif">Savatga qo‘shish</span>
          </motion.button>
        </div>
      </div>

      {/* 2. Structured Shopping Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div className="space-y-1">
          {/* Brand & Category Label */}
          <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
            <span className="truncate uppercase tracking-wider font-semibold font-serif text-[#78716c]">
              {product.brand || product.seller.name}
            </span>
            {product.size && (
              <span className="px-1.5 py-0.2 bg-[#f4efe6] text-[#57534e] rounded text-[9px] font-bold border border-[#e7e0d3]/60 font-mono">
                {product.size}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-[13.5px] font-semibold text-[#1c1917] leading-snug line-clamp-2 group-hover:text-[#b85d3f] transition-colors font-serif">
            {product.name}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 text-[11px] pt-0.5">
            <div className="flex items-center text-[#c59838]">
              <Star className="w-3 h-3 fill-[#c59838] stroke-[#c59838]" />
            </div>
            <span className="font-bold text-stone-800">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[10px]">({product.reviewCount} ta sharh)</span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-1.5 border-t border-[#f0eae1]">
          {/* Installment Badge */}
          {product.price >= 80000 && (
            <div className="inline-block bg-[#fdf6e7] text-[#926d1d] border border-[#ebd9a9] text-[9.5px] font-bold px-1.5 py-0.5 rounded mb-1 font-serif">
              oyiga {monthlyPayment.toLocaleString('uz-UZ')} so'm
            </div>
          )}

          <div className="flex items-center justify-between mt-0.5">
            <div>
              <div className="text-sm sm:text-base font-bold text-[#1c1917] font-display">
                {formatUZS(product.price)}
              </div>

              {hasDiscount && product.oldPrice && (
                <div className="text-[10px] sm:text-[11px] text-stone-400 line-through">
                  {formatUZS(product.oldPrice)}
                </div>
              )}
            </div>

            {/* Mobile Quick Add Button */}
            <motion.button
              id={`quick-add-${product.id}`}
              type="button"
              whileTap={{ scale: 0.88 }}
              onClick={handleQuickAdd}
              className="sm:hidden w-8 h-8 rounded-xl bg-[#1c3829] active:bg-[#284c37] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0 border border-white/20"
              title="Savatga qo'shish"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
