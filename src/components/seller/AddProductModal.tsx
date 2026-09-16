import React, { useState } from 'react';
import {
  X,
  Plus,
  CheckCircle2,
  Store,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductCategory, ProductSize, Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Preset photo options by category for quick professional listings
const CATEGORY_IMAGE_PRESETS: Record<string, string[]> = {
  'pots-planters': [
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
  ],
  'soil-substrates': [
    'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  ],
  'plant-medicine': [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  ],
  'fertilizers': [
    'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
  ],
  'gardening-accessories': [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  ],
  'live-plants': [
    'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
  ],
  'orchids': [
    'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=800&q=80',
  ],
  'roses': [
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
  ],
  'bouquets': [
    'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
  ],
  'bonsai': [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  ],
};

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct, showToast, openProduct } = useApp();

  const [name, setName] = useState('');
  const [uzbekName, setUzbekName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('pots-planters');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [stockCount, setStockCount] = useState('20');
  const [size, setSize] = useState<ProductSize>('M');
  const [brand, setBrand] = useState('Florist Shop UZ');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80'
  );
  const [customTag, setCustomTag] = useState('');

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    const presets = CATEGORY_IMAGE_PRESETS[newCat] || CATEGORY_IMAGE_PRESETS['pots-planters'];
    setImageUrl(presets[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numPrice = parseInt(price.replace(/\D/g, ''), 10);
    if (!numPrice || numPrice <= 0) {
      showToast('Iltimos, haqiqiy narxni kiriting', 'error');
      return;
    }

    if (!name.trim()) {
      showToast('Mahsulot nomini kiriting', 'error');
      return;
    }

    const numOldPrice = oldPrice ? parseInt(oldPrice.replace(/\D/g, ''), 10) : undefined;
    const discount = numOldPrice && numOldPrice > numPrice
      ? Math.round(((numOldPrice - numPrice) / numOldPrice) * 100)
      : undefined;

    const newProdId = `prod-custom-${Date.now()}`;
    const tagsList = [category, brand.toLowerCase()];
    if (customTag.trim()) {
      tagsList.push(customTag.trim().toLowerCase());
    }

    const newProduct: Product = {
      id: newProdId,
      name: name.trim(),
      uzbekName: uzbekName.trim() || name.trim(),
      category,
      price: numPrice,
      oldPrice: numOldPrice,
      discountPercent: discount,
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      stockCount: parseInt(stockCount, 10) || 10,
      images: [imageUrl],
      description: description.trim() || `${name} — gullar bozori platformasida sotuvga qo‘yilgan yuqori sifatli mahsulot.`,
      shortDescription: shortDescription.trim() || name.trim(),
      brand: brand.trim() || 'Botanica UZ',
      size,
      isNewArrival: true,
      isPopular: true,
      tags: tagsList,
      sellerId: 'seller-custom-vendor',
      seller: {
        id: 'seller-custom-vendor',
        name: brand.trim() || 'Botanica UZ',
        rating: 5.0,
        city: 'Toshkent',
        verified: true,
        totalProducts: 1,
        deliveryTimeDays: '1-2 kun',
      },
    };

    addProduct(newProduct);
    showToast(`"${name}" mahsuloti sotuvga muvaffaqiyatli qo‘shildi! 🎉`, 'success');
    onClose();
    openProduct(newProdId);
  };

  const currentPresets = CATEGORY_IMAGE_PRESETS[category] || CATEGORY_IMAGE_PRESETS['pots-planters'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white/95 backdrop-blur-xl w-full max-w-xl rounded-3xl shadow-2xl border border-[#e7e0d3] overflow-hidden my-auto max-h-[92vh] flex flex-col font-serif z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#e7e0d3] flex items-center justify-between bg-stone-50/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1c3829] text-white flex items-center justify-center shadow-xs">
                <Store className="w-5 h-5 text-[#dfb15b]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900 font-display">Mahsulotni sotuvga qo‘yish</h2>
                <p className="text-xs text-stone-500">Tuvak, tuproq, dori, o‘g‘it va gullarni bozorda soting</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
            {/* 1. Category Selection */}
            <div className="space-y-1.5">
              <label className="block font-bold text-stone-800 font-display">
                Kategoriya <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'pots-planters', label: '🪴 Gultuvaklar' },
                  { id: 'soil-substrates', label: '🪨 Tuproq & Substrat' },
                  { id: 'plant-medicine', label: '💊 Dori & Himoya' },
                  { id: 'fertilizers', label: '🧪 O‘g‘itlar' },
                  { id: 'gardening-accessories', label: '✂️ Aksessuarlar' },
                  { id: 'live-plants', label: '🌿 Xona gullari' },
                  { id: 'orchids', label: '🌸 Orxideyalar' },
                  { id: 'roses', label: '🌹 Atirgullar' },
                  { id: 'bouquets', label: '💐 Guldastalar' },
                ].map(catItem => (
                  <motion.button
                    type="button"
                    key={catItem.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleCategoryChange(catItem.id as ProductCategory)}
                    className={`p-2.5 rounded-xl text-left font-semibold border transition-all cursor-pointer flex items-center justify-between text-[11px] ${
                      category === catItem.id
                        ? 'bg-[#1c3829]/10 border-[#1c3829] text-[#1c3829] ring-1 ring-[#1c3829]'
                        : 'bg-white/80 border-[#e7e0d3] text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{catItem.label}</span>
                    {category === catItem.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#1c3829] shrink-0" />}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 2. Product Name & Short Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-stone-800 font-display">
                  Mahsulot to‘liq nomi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masalan: Terrakota loy tuvak 24cm"
                  className="w-full p-2.5 bg-stone-50/80 border border-[#e7e0d3] rounded-xl focus:bg-white focus:border-[#1c3829] focus:outline-hidden text-stone-900"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-stone-800 font-display">Do‘kon / Sotuvchi nomi</label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="Masalan: Chorsu Flora do‘koni"
                  className="w-full p-2.5 bg-stone-50/80 border border-[#e7e0d3] rounded-xl focus:bg-white focus:border-[#1c3829] focus:outline-hidden text-stone-900"
                />
              </div>
            </div>

            {/* 3. Pricing & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-stone-800 font-display">
                  Sotuv narxi (so‘m) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Masalan: 65000"
                  className="w-full p-2.5 bg-stone-50/80 border border-[#e7e0d3] rounded-xl focus:bg-white focus:border-[#1c3829] focus:outline-hidden text-stone-900 font-bold font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-800 font-display">Eski narx (chegirma uchun)</label>
                <input
                  type="number"
                  value={oldPrice}
                  onChange={e => setOldPrice(e.target.value)}
                  placeholder="Masalan: 80000"
                  className="w-full p-2.5 bg-stone-50/80 border border-[#e7e0d3] rounded-xl focus:bg-white focus:border-[#1c3829] focus:outline-hidden text-stone-900 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-800 font-display">Mavjud soni (dona)</label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={e => setStockCount(e.target.value)}
                  className="w-full p-2.5 bg-stone-50/80 border border-[#e7e0d3] rounded-xl focus:bg-white focus:border-[#1c3829] focus:outline-hidden text-stone-900 font-mono"
                  min="1"
                />
              </div>
            </div>

            {/* 4. Size & Quick Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-bold text-stone-800 font-display">O‘lchami</label>
                <div className="flex gap-1.5">
                  {(['S', 'M', 'L', 'XL'] as ProductSize[]).map(s => (
                    <motion.button
                      type="button"
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSize(s)}
                      className={`flex-1 py-2 rounded-xl text-center font-bold border transition-colors cursor-pointer font-mono ${
                        size === s
                          ? 'bg-[#1c3829] text-white border-[#1c3829]'
                          : 'bg-stone-50 border-[#e7e0d3] text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-800 font-display">Qidiruv tegi (tag)</label>
                <input
                  type="text"
                  value={customTag}
                  onChange={e => setCustomTag(e.target.value)}
                  placeholder="Masalan: drenaj, osiluvchi, bio"
                  className="w-full p-2.5 bg-stone-50/80 border border-[#e7e0d3] rounded-xl focus:bg-white focus:border-[#1c3829] focus:outline-hidden text-stone-900"
                />
              </div>
            </div>

            {/* 5. Photo Preset */}
            <div className="space-y-2">
              <label className="block font-bold text-stone-800 font-display">Mahsulot rasmi</label>
              <div className="flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Ko‘rinish"
                  className="w-16 h-16 rounded-2xl object-cover border border-[#e7e0d3] bg-stone-100 shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="text-[11px] text-stone-500 font-medium">Tayyor professional rasmlardan tanlang:</div>
                  <div className="flex gap-2">
                    {currentPresets.map((presetUrl, idx) => (
                      <motion.button
                        type="button"
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setImageUrl(presetUrl)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          imageUrl === presetUrl ? 'border-[#1c3829] scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={presetUrl} alt="" className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Description */}
            <div className="space-y-1">
              <label className="block font-bold text-stone-800 font-display">Tavsif va xususiyatlari</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mahsulotning afzalliklari, tarkibi yoki o'lchamlari haqida yozing..."
                className="w-full p-2.5 bg-stone-50/80 border border-[#e7e0d3] rounded-xl focus:bg-white focus:border-[#1c3829] focus:outline-hidden text-stone-900 leading-relaxed"
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-[#e7e0d3] font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Bekor qilish
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-2xl bg-[#1c3829] hover:bg-[#284c37] text-white font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 border border-white/20"
              >
                <Plus className="w-4 h-4" />
                <span>Sotuvga qo‘yish</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
