import React, { useEffect, useState } from 'react';
import {
  Heart,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Truck,
  CheckCircle,
  Sun,
  Droplets,
  Thermometer,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Camera,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { marketplaceService } from '../../services/marketplaceService';
import { Product, ProductSize } from '../../types';
import { formatUZS } from '../../utils/formatters';
import { ProductCard } from '../common/ProductCard';
import { IOSSmoothImage } from '../common/IOSSmoothImage';
import { IOSCameraRoomModal } from './IOSCameraRoomModal';
import { DirectPurchaseModal } from '../checkout/DirectPurchaseModal';

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { addToCart, isFavorite, toggleFavorite, navigate, showToast, goBack } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'delivery' | 'reviews'>('details');
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [recommendations, setRecommendations] = useState<{
    recommendedPot?: Product;
    recommendedSoil?: Product;
    recommendedFertilizer?: Product;
    recommendedAccessory?: Product;
    relatedProducts: Product[];
  }>({ relatedProducts: [] });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    marketplaceService.getProductById(productId).then(p => {
      if (p) {
        setProduct(p);
        setSelectedSize(p.size);
        setActiveImageIndex(0);
        setQuantity(1);
      }
    });

    marketplaceService.getRecommendations(productId).then(setRecommendations);
  }, [productId]);

  useEffect(() => {
    if (showCameraModal || showPurchaseModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCameraModal, showPurchaseModal]);

  if (!product) {
    return (
      <div className="w-full max-w-7xl mx-auto py-8 space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <div className="aspect-square bg-stone-200/70 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-stone-200/70 rounded w-1/3" />
            <div className="h-8 bg-stone-200/70 rounded w-3/4" />
            <div className="h-6 bg-stone-200/70 rounded w-1/2" />
            <div className="h-24 bg-stone-200/70 rounded-2xl w-full" />
            <div className="h-12 bg-stone-200/70 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    showToast(`${quantity}x ${product.name} savatga qo'shildi! 🌿`, 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Havola nusxalandi! 📋', 'success');
    }
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top navigation row */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer font-serif"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Katalogga qaytish</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          title="Ulashish"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Main Product Layout (2-column desktop, stacked mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
        {/* Left Column: Product Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-[#e7e0d3] isolate shadow-xs group">
            <AnimatePresence mode="wait">
              <motion.div
                key={`gallery-${activeImageIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full"
              >
                <IOSSmoothImage
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  priority={true}
                  hoverScale={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges */}
            {product.discountPercent && product.discountPercent > 0 && (
              <div className="absolute top-3.5 left-3.5 bg-[#b85d3f] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full font-serif shadow-xs z-10 border border-white/20">
                -{product.discountPercent}% CHEGIRMA
              </div>
            )}

            {/* Live Camera Viewfinder Trigger Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCameraModal(true)}
              className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-white text-stone-900 backdrop-blur-md text-xs font-semibold shadow-xs border border-stone-200/80 cursor-pointer font-serif"
              title="Xonada jonli kamerada sinab ko'rish"
            >
              <Camera className="w-3.5 h-3.5 text-[#1c3829]" />
              <span>Xonada ko'rish (AR)</span>
            </motion.button>

            {/* Next / Previous Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex(prev => (prev > 0 ? prev - 1 : product.images.length - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs z-10 cursor-pointer"
                  aria-label="Oldingi rasm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex(prev => (prev < product.images.length - 1 ? prev + 1 : 0))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-900 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs z-10 cursor-pointer"
                  aria-label="Keyingi rasm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Image Index Counter Pill */}
                <div className="absolute bottom-3.5 right-3.5 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider font-mono">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer bg-stone-100 ${
                    activeImageIndex === idx
                      ? 'border-[#1c3829] shadow-xs scale-102'
                      : 'border-transparent hover:border-stone-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <IOSSmoothImage src={img} alt="" hoverScale={false} />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details, Purchasing & Specs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Brand & Stock status */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-serif">
                {product.brand || product.seller.name}
              </span>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#1c3829] font-serif">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mavjud ({product.stockCount} dona)</span>
              </div>
            </div>

            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-stone-900 leading-snug font-display">
              {product.name}
            </h1>

            {product.latinName && (
              <p className="text-xs text-stone-400 font-serif italic">{product.latinName}</p>
            )}
          </div>

          {/* Star Rating & Seller */}
          <div className="flex items-center gap-2.5 text-xs text-stone-500 pb-2 border-b border-[#e7e0d3]">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="font-bold text-stone-900 font-mono">{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span
              onClick={() => setActiveTab('reviews')}
              className="text-stone-800 font-medium hover:underline cursor-pointer font-serif"
            >
              {product.reviewCount} ta sharh
            </span>
            <span>•</span>
            <span className="truncate text-stone-500 font-serif">{product.seller.name}</span>
          </div>

          {/* Price */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl sm:text-2xl font-extrabold text-[#1c3829] tracking-tight font-price">
                {formatUZS(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-sm text-stone-400 line-through font-normal font-price">
                  {formatUZS(product.oldPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 font-sans">QQS narx ichida. 300 000 so'mdan yuqori buyurtmalarga bepul yetkazish.</p>
          </div>

          {/* Size Selector if available */}
          {product.size && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-stone-800 block font-serif">
                O'lcham: {selectedSize}
              </span>
              <div className="flex gap-1.5">
                {(['S', 'M', 'L', 'XL'] as ProductSize[]).map(size => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer font-mono ${
                      selectedSize === size
                        ? 'bg-[#1c3829] text-white border-[#1c3829] shadow-xs'
                        : 'bg-white text-stone-800 border-[#e7e0d3] hover:border-[#b85d3f]'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-semibold text-stone-800 font-serif">Miqdor:</span>
            <div className="flex items-center border border-[#e7e0d3] rounded-full px-2.5 py-0.5 bg-white/80 backdrop-blur-xs">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="w-7 text-center text-xs font-bold text-stone-900 font-mono">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setQuantity(prev => Math.min(product.stockCount, prev + 1))}
                className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Primary & Secondary Action CTAs */}
          <div className="space-y-2 pt-2">
            <motion.button
              id="buy-now-primary-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPurchaseModal(true)}
              className="w-full py-3 px-5 bg-[#b85d3f] hover:bg-[#96472f] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center font-serif border border-white/25"
            >
              <CreditCard className="w-4 h-4 text-[#ffe6dd]" />
              <span>Sotib olish • {formatUZS(product.price * quantity)}</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                id="add-to-cart-secondary-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 py-2.5 px-4 bg-[#1c3829] hover:bg-[#284c37] text-white font-semibold text-xs rounded-xl border border-white/20 transition-all cursor-pointer text-center font-serif"
              >
                Savatga qo‘shish
              </motion.button>

              <motion.button
                id="wishlist-secondary-btn"
                whileTap={{ scale: 0.85 }}
                onClick={() => toggleFavorite(product.id)}
                className={`w-10 h-10 rounded-xl border border-[#e7e0d3] hover:border-[#b85d3f] flex items-center justify-center transition-colors cursor-pointer shrink-0 glass-pill ${
                  favorite ? 'bg-[#fdf3ef] text-[#b85d3f] border-[#f5d9cf]' : 'text-stone-500'
                }`}
                title="Saralanganlar"
              >
                <Heart className={`w-4.5 h-4.5 ${favorite ? 'fill-[#b85d3f] text-[#b85d3f]' : 'stroke-[1.8]'}`} />
              </motion.button>
            </div>
          </div>

          {/* Guarantee Highlights */}
          <div className="pt-3 border-t border-[#e7e0d3] space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#1c3829] shrink-0" />
              <span className="font-serif">Maxsus termo-quti va iqlim nazorati bilan yetkazish</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#926d1d] shrink-0" />
              <span className="font-serif">14 kunlik sog'lom o'simlik almashtirish kafolati</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Care, Delivery, Reviews */}
      <div className="space-y-4 pt-4 border-t border-[#e7e0d3]">
        <div className="flex border-b border-[#e7e0d3] gap-4 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto pb-0.5 scrollbar-none font-serif">
          {[
            { id: 'details', label: 'Tavsif & Xususiyatlar' },
            ...(product.plantCare || product.medicineFertilizer
              ? [{ id: 'care', label: product.medicineFertilizer ? "Qo'llash yo'riqnomasi" : "Parvarishlash qo'llanmasi" }]
              : []),
            { id: 'delivery', label: 'Yetkazib berish & Kafolat' },
            { id: 'reviews', label: `Sharhlar (${product.reviewCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 transition-colors border-b-2 cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'border-[#1c3829] text-[#1c3829] font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Animated */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'details' && (
              <div className="space-y-3 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-600 font-serif">
                <p>{product.description}</p>
                {product.dimensions && (
                  <div className="pt-1">
                    <span className="font-semibold text-stone-900">O'lchamlari: </span>
                    <span>{product.dimensions}</span>
                  </div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.tags.map(tag => (
                      <span key={tag} className="text-[11px] px-2.5 py-0.5 bg-stone-100 rounded-full text-stone-600 border border-stone-200/60 font-serif">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'care' && product.plantCare && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl font-serif">
                <div className="p-3.5 glass-card rounded-2xl space-y-1">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <div className="text-xs font-bold text-stone-900">Quyosh nuri</div>
                  <div className="text-xs text-stone-600">{product.plantCare.light}</div>
                </div>
                <div className="p-3.5 glass-card rounded-2xl space-y-1">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <div className="text-xs font-bold text-stone-900">Sug'orish</div>
                  <div className="text-xs text-stone-600">{product.plantCare.watering}</div>
                </div>
                <div className="p-3.5 glass-card rounded-2xl space-y-1">
                  <Thermometer className="w-4 h-4 text-rose-500" />
                  <div className="text-xs font-bold text-stone-900">Harorat</div>
                  <div className="text-xs text-stone-600">{product.plantCare.temperature}</div>
                </div>
                <div className="p-3.5 glass-card rounded-2xl space-y-1">
                  <Sparkles className="w-4 h-4 text-[#1c3829]" />
                  <div className="text-xs font-bold text-stone-900">Murakkabligi</div>
                  <div className="text-xs text-stone-600">{product.plantCare.difficulty}</div>
                </div>
              </div>
            )}

            {activeTab === 'care' && product.medicineFertilizer && (
              <div className="space-y-4 max-w-3xl font-serif">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 space-y-1">
                    <div className="text-xs font-bold text-emerald-900">Asosiy vazifasi</div>
                    <div className="text-xs text-emerald-800 leading-relaxed">{product.medicineFertilizer.purpose}</div>
                  </div>
                  <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/70 space-y-1">
                    <div className="text-xs font-bold text-amber-900">Qadoq hajmi & Tarkib</div>
                    <div className="text-xs text-amber-800 leading-relaxed font-mono">
                      {product.medicineFertilizer.packageSize}
                      {product.medicineFertilizer.activeIngredients && ` (${product.medicineFertilizer.activeIngredients})`}
                    </div>
                  </div>
                </div>

                <div className="p-4 glass-card rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-stone-900">Qo'llash tartibi va tavsiya etilgan doza:</div>
                  <p className="text-xs text-stone-700 leading-relaxed">{product.medicineFertilizer.usageInstructions}</p>
                </div>

                {product.medicineFertilizer.suitablePlants && product.medicineFertilizer.suitablePlants.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-stone-900">Mos o'simliklar:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {product.medicineFertilizer.suitablePlants.map(p => (
                        <span key={p} className="text-[11px] px-2.5 py-0.5 bg-emerald-100/70 text-emerald-900 font-medium rounded-full border border-emerald-200">
                          🌿 {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.medicineFertilizer.safetyCaution && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/80 text-[11px] text-rose-800 leading-relaxed">
                    <strong>Ehtiyot choralari: </strong>
                    {product.medicineFertilizer.safetyCaution}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-2 max-w-2xl text-xs text-stone-600 leading-relaxed font-serif">
                <p><strong>Tezkor kuryer:</strong> Toshkent shahrida 1-2 kun ichida. Soat 14:00 gacha buyurtma qilingan guldastalar o'sha kunning o'zida yetkaziladi.</p>
                <p><strong>Viloyatlarga yetkazish:</strong> Samarqand, Buxoro, Farg'ona, Andijon, Namangan va boshqa barcha viloyatlar markazlariga 2-3 ish kuni.</p>
                <p><strong>Qabul qilish eslatmasi:</strong> O'simlikni yetkazib berilgach ehtiyotkorlik bilan oching va ilova qilingan parvarish yo'riqnomasi bo'yicha sug'oring.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3 max-w-2xl font-serif">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-black text-stone-900 font-display font-mono">{product.rating.toFixed(1)}</span>
                  <div className="text-xs text-stone-500">
                    <div className="flex text-amber-400 text-sm">★★★★★</div>
                    <span>{product.reviewCount} ta xaridor bahosi asosida</span>
                  </div>
                </div>
                <p className="text-xs text-stone-500">Barcha sharhlar tasdiqlangan xaridlar orqali yozilgan.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Recommendations / Related Products */}
      {recommendations.relatedProducts.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-[#e7e0d3]">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 font-display">
              Sizga yoqishi mumkin bo'lgan o'simliklar
            </h3>
            <button
              onClick={() => navigate({ type: 'tab', tab: 'catalog' })}
              className="text-xs font-semibold text-[#1c3829] hover:underline font-serif cursor-pointer"
            >
              Barchasi →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {recommendations.relatedProducts.slice(0, 4).map((rel, idx) => (
              <ProductCard key={`related-${rel.id}-${idx}`} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Quick Action Bar (Visible only on mobile/small devices) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-4 pt-2.5 pb-safe bg-white/95 backdrop-blur-xl border-t border-[#e7e0d3] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] text-stone-500 font-sans">Umumiy narx:</span>
          <span className="text-sm font-extrabold text-[#1c1917] font-price">
            {formatUZS(product.price * quantity)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="px-3.5 py-2.5 rounded-xl bg-[#1c3829] text-white text-xs font-semibold font-serif shadow-xs border border-white/20 cursor-pointer"
          >
            Savatga
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPurchaseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#b85d3f] text-white text-xs font-bold font-serif shadow-xs border border-white/25 flex items-center gap-1.5 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Sotib olish</span>
          </motion.button>
        </div>
      </div>

      {/* iOS Camera / AR Room Preview Modal */}
      {showCameraModal && product && (
        <IOSCameraRoomModal
          product={product}
          isOpen={showCameraModal}
          onClose={() => setShowCameraModal(false)}
        />
      )}

      {/* Direct Purchase Modal (16-digit card -> Business Card -> Receipt Upload) */}
      {showPurchaseModal && product && (
        <DirectPurchaseModal
          product={product}
          selectedSize={selectedSize}
          initialQuantity={quantity}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}
    </div>
  );
};
