import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatUZS } from '../../utils/formatters';
import { IOSSmoothImage } from '../common/IOSSmoothImage';

export const CartView: React.FC = () => {
  const {
    cart,
    savedForLater,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartTotalCount,
    appliedPromo,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    usedBonusPoints,
    navigate,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');

  // Free delivery threshold: 300,000 UZS
  const freeDeliveryThreshold = 300000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const estimatedDelivery = cartSubtotal >= freeDeliveryThreshold ? 0 : 25000;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput.trim());
      setPromoInput('');
    }
  };

  const totalAmount = Math.max(0, cartSubtotal + estimatedDelivery - promoDiscount - usedBonusPoints);

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="py-16 text-center space-y-3 max-w-md mx-auto"
      >
        <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 text-stone-900 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 font-display">Savatingiz bo'sh</h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed font-serif">
            Uy va ofisingiz uchun chiroyli o'simliklar, sopol tuvaklar va guldastalarni tanlang.
          </p>
        </div>
        <div className="pt-2">
          <motion.button
            id="empty-cart-shop-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate({ type: 'tab', tab: 'catalog' })}
            className="px-5 py-2.5 bg-[#1c3829] hover:bg-[#284c37] text-white font-semibold text-xs rounded-full shadow-xs transition-transform cursor-pointer font-serif"
          >
            Xarid qilishni boshlash →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[#e7e0d3] pb-3"
      >
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-display">
          Xarid savati ({cartTotalCount})
        </h1>
        {remainingForFreeDelivery > 0 ? (
          <p className="text-xs text-stone-500 mt-0.5 font-serif">
            Bepul yetkazish uchun yana <strong className="text-stone-900 font-mono">{formatUZS(remainingForFreeDelivery)}</strong> lik mahsulot qo'shing.
          </p>
        ) : (
          <p className="text-xs text-[#1c3829] font-medium mt-0.5 flex items-center gap-1 font-serif">
            <Truck className="w-3.5 h-3.5" />
            <span>Bepul yetkazib berish huquqiga ega bo'ldingiz!</span>
          </p>
        )}
      </motion.div>

      {/* Main Grid: Cart Items (7 cols) + Order Summary (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Cart Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.map((item, idx) => (
              <motion.div
                key={item.id || `cart-item-${item.product.id}-${item.selectedSize || 'std'}-${idx}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl glass-card border border-[#e7e0d3] transition-all shadow-2xs"
              >
                {/* Product Thumbnail */}
                <div
                  onClick={() => navigate({ type: 'product_detail', productId: item.product.id })}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 cursor-pointer border border-[#e7e0d3]"
                >
                  <IOSSmoothImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    hoverScale={false}
                  />
                </div>

                {/* Info & Controls */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide font-serif">
                        {item.product.brand || item.product.seller.name}
                      </div>
                      <h3
                        onClick={() => navigate({ type: 'product_detail', productId: item.product.id })}
                        className="text-xs sm:text-sm font-semibold text-stone-900 truncate cursor-pointer hover:underline font-serif"
                      >
                        {item.product.name}
                      </h3>
                      {item.selectedSize && (
                        <span className="text-[11px] text-stone-500 font-serif">O'lcham: {item.selectedSize}</span>
                      )}
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.15, color: '#b85d3f' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="p-1 text-stone-400 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>

                  {/* Price and Quantity Controls */}
                  <div className="flex items-center justify-between pt-1.5">
                    <div className="text-xs sm:text-sm font-bold text-stone-900 font-mono">
                      {formatUZS(item.product.price * item.quantity)}
                    </div>

                    <div className="flex items-center border border-[#e7e0d3] rounded-full px-1.5 py-0.5 bg-white/90 shadow-2xs">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                        className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </motion.button>
                      <span className="w-6 text-center text-xs font-bold text-stone-900 font-mono">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                        className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue Shopping button */}
          <motion.button
            whileHover={{ x: -2 }}
            onClick={() => navigate({ type: 'tab', tab: 'catalog' })}
            className="text-xs font-semibold text-[#1c3829] hover:text-[#284c37] transition-colors inline-flex items-center gap-1 pt-1 cursor-pointer font-serif"
          >
            ← Xaridlarni davom ettirish
          </motion.button>
        </div>

        {/* Order Summary (5 cols) in Frosted Glass */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 p-4 sm:p-6 rounded-2xl glass-card space-y-4 shadow-sm border border-white/60"
        >
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-stone-900 font-display">
            Buyurtma Xulosasi
          </h2>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-1.5">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value)}
                placeholder="Promokod (masalan, BAHOR2026)"
                className="flex-1 px-3 py-2 bg-white/80 rounded-xl border border-[#e7e0d3] text-xs text-stone-900 focus:outline-hidden focus:border-[#1c3829] font-serif"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-3.5 py-2 bg-[#1c3829] hover:bg-[#284c37] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs font-serif"
              >
                Qo'llash
              </motion.button>
            </div>
            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-[#1c3829] bg-[#eaf2ec] px-2.5 py-1 rounded-lg border border-[#c1d9c9] font-serif">
                <span>Kod {appliedPromo.code} qo'llandi (-{formatUZS(promoDiscount)})</span>
                <button onClick={removePromoCode} className="underline text-[#b85d3f] font-bold cursor-pointer">O'chirish</button>
              </div>
            )}
          </form>

          {/* Breakdown: Subtotal, Delivery, Total */}
          <div className="space-y-2 text-xs text-stone-600 border-t border-[#e7e0d3] pt-3 font-serif">
            <div className="flex justify-between">
              <span>Mahsulotlar summasi</span>
              <span className="font-semibold text-stone-900 font-mono">{formatUZS(cartSubtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Yetkazib berish (Termo-quti)</span>
              <span>
                {estimatedDelivery === 0 ? (
                  <strong className="text-[#1c3829] font-bold">BEPUL</strong>
                ) : (
                  <span className="font-mono">{formatUZS(estimatedDelivery)}</span>
                )}
              </span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#b85d3f] font-medium">
                <span>Promokod chegirmasi</span>
                <span className="font-mono">-{formatUZS(promoDiscount)}</span>
              </div>
            )}

            {usedBonusPoints > 0 && (
              <div className="flex justify-between text-[#1c3829] font-medium">
                <span>Bonus ballar</span>
                <span className="font-mono">-{formatUZS(usedBonusPoints)}</span>
              </div>
            )}

            <div className="border-t border-[#e7e0d3] pt-2.5 flex justify-between items-baseline">
              <span className="text-xs sm:text-sm font-bold text-stone-900 font-display">Jami to'lov</span>
              <div className="text-right">
                <span className="text-base sm:text-xl font-bold text-[#1c3829] font-display font-mono">
                  {formatUZS(totalAmount)}
                </span>
                <p className="text-[10px] text-stone-400 font-serif italic">QQS va maxsus xavfsiz o'rash narxi ichida</p>
              </div>
            </div>
          </div>

          {/* Primary checkout button */}
          <motion.button
            id="cart-checkout-proceed-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate({ type: 'checkout' })}
            className="w-full py-3 px-4 bg-[#b85d3f] hover:bg-[#96472f] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-serif border border-white/25"
          >
            <span>Buyurtmani rasmiylashtirish</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </motion.button>

          {/* Trust Guarantees */}
          <div className="pt-1 text-[11px] text-stone-500 space-y-1 font-serif">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1c3829] shrink-0" />
              <span>Payme, Uzum, Click yoki to'g'ridan-to'g'ri karta orqali</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#1c3829] shrink-0" />
              <span>Issiqxona va termo-qutilarda xavfsiz yetkazish</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
