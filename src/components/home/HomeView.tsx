import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Truck,
  ShieldCheck,
  Droplets,
  Sparkles,
  Flame,
  ArrowRight,
  ChevronRight,
  Star,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../common/ProductCard';
import { SectionHeader } from '../ui/SectionHeader';
import { ProductCategory } from '../../types';
import { formatUZS } from '../../utils/formatters';
import { FlashSaleCountdown } from './FlashSaleCountdown';

interface CategoryChipItem {
  id: string;
  label: string;
  category: ProductCategory;
  imageUrl: string;
  itemCount: string;
}

export const HomeView: React.FC = () => {
  const { allProducts, navigate, openCategory, openProduct, addToCart, showToast } = useApp();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'pots' | 'care' | 'bouquets'>('trending');
  const [heroSlide, setHeroSlide] = useState(0);

  // Hero carousel banners
  const heroBanners = useMemo(
    () => [
      {
        title: "Xona Gullari & Bog'dorchilik Markazi",
        subtitle: "Toshkent va butun O'zbekiston uchun eng sara xona o'simliklari, tabiiy sopol tuvaklar va professional bio-substratlar",
        badge: "🌿 Bahor 2026 Yangi To'plami",
        discount: "30% GACHA CHEGIRMA",
        cta: "Katalogni ko'rish",
        action: () => navigate({ type: 'tab', tab: 'catalog' }),
        bgGradient: "from-[#12241a] via-[#1c3829] to-[#2a4e3b]",
        image: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1200&auto=format&fit=crop&q=80",
      },
      {
        title: "Sara Terrakota & Sopol Tuvaklar",
        subtitle: "Pishgan tabiiy loydan yasalgan gultuvaklar, nafis keramika va avto-sug'orishli premium kashpolar to'plami",
        badge: "🪴 100% Tabiiy Sopol",
        discount: "YANGI IMPORT",
        cta: "Tuvaklarni tanlash",
        action: () => openCategory('pots-planters'),
        bgGradient: "from-[#291711] via-[#5c2d1f] to-[#8a3a24]",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&auto=format&fit=crop&q=80",
      },
      {
        title: "O'simliklar Shifoxonasi & Bio-Oziqlar",
        subtitle: "Bio-fungitsidlar, ildiz o'stiruvchilar, Osmocote va aroidlar uchun maxsus tozalangan tuproq aralashmalari",
        badge: "💊 100% Kafolatlangan Natija",
        discount: "MUTAXASSIS TANLOVI",
        cta: "Dorilar & O'g'itlar",
        action: () => openCategory('plant-medicine'),
        bgGradient: "from-[#18232c] via-[#223b49] to-[#1c3829]",
        image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=1200&auto=format&fit=crop&q=80",
      },
    ],
    [navigate, openCategory]
  );

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(heroTimer);
  }, [heroBanners.length]);

  // Filtered products when search query is active
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allProducts.filter(p => {
      return Boolean(
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.latinName && p.latinName.toLowerCase().includes(q)) ||
        (p.uzbekName && p.uzbekName.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t && t.toLowerCase().includes(q)))
      );
    });
  }, [allProducts, searchQuery]);

  // Categories list with counts
  const categoryChips: CategoryChipItem[] = useMemo(
    () => [
      {
        id: 'indoor-plants',
        label: 'Xona gullari',
        category: 'live-plants',
        imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&auto=format&fit=crop&q=80',
        itemCount: '128+ xil',
      },
      {
        id: 'pots',
        label: 'Gultuvaklar',
        category: 'pots-planters',
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&auto=format&fit=crop&q=80',
        itemCount: '64+ xil',
      },
      {
        id: 'soil',
        label: 'Tuproqlar',
        category: 'soil-substrates',
        imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=200&auto=format&fit=crop&q=80',
        itemCount: '42+ xil',
      },
      {
        id: 'medicines',
        label: 'Dori-darmon',
        category: 'plant-medicine',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80',
        itemCount: '38+ xil',
      },
      {
        id: 'fert',
        label: "O'g'itlar",
        category: 'fertilizers',
        imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=200&auto=format&fit=crop&q=80',
        itemCount: '56+ xil',
      },
      {
        id: 'bouquets',
        label: 'Guldastalar',
        category: 'bouquets',
        imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&auto=format&fit=crop&q=80',
        itemCount: '24+ xil',
      },
      {
        id: 'orchids',
        label: 'Orxideyalar',
        category: 'orchids',
        imageUrl: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=200&auto=format&fit=crop&q=80',
        itemCount: '45+ xil',
      },
      {
        id: 'exotic',
        label: 'Ekzotik gullar',
        category: 'exotic-plants',
        imageUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200&auto=format&fit=crop&q=80',
        itemCount: '19+ xil',
      },
      {
        id: 'bonsai',
        label: 'Bonsaylar',
        category: 'bonsai',
        imageUrl: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=200&auto=format&fit=crop&q=80',
        itemCount: '28+ xil',
      },
      {
        id: 'tools',
        label: 'Asboblar',
        category: 'gardening-accessories',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&auto=format&fit=crop&q=80',
        itemCount: '32+ xil',
      },
    ],
    []
  );

  // Specific filtered lists for rich sections
  const flashSaleProduct = useMemo(
    () => allProducts.find(p => p.discountPercent && p.discountPercent >= 20) || allProducts[0],
    [allProducts]
  );
  const trendingPlants = useMemo(() => allProducts.slice(0, 10), [allProducts]);
  const potsAndPlanters = useMemo(
    () => allProducts.filter(p => p.category === 'pots-planters').slice(0, 5),
    [allProducts]
  );
  const careAndSoil = useMemo(
    () =>
      allProducts
        .filter(
          p =>
            p.category === 'soil-substrates' ||
            p.category === 'plant-medicine' ||
            p.category === 'fertilizers'
        )
        .slice(0, 5),
    [allProducts]
  );
  const newArrivals = useMemo(() => allProducts.filter(p => p.isNewArrival).slice(0, 10), [allProducts]);
  const bouquets = useMemo(
    () => allProducts.filter(p => p.category === 'bouquets').slice(0, 5),
    [allProducts]
  );

  const activeTabProducts = useMemo(() => {
    switch (activeTab) {
      case 'trending':
        return trendingPlants;
      case 'new':
        return newArrivals;
      case 'pots':
        return potsAndPlanters;
      case 'care':
        return careAndSoil;
      case 'bouquets':
        return bouquets;
      default:
        return trendingPlants;
    }
  }, [activeTab, trendingPlants, newArrivals, potsAndPlanters, careAndSoil, bouquets]);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 sm:space-y-10 pb-12 font-serif overflow-x-hidden">
      {/* 1. Search Bar & Trending Quick Pills */}
      <section id="home-search-section" className="w-full min-w-0 space-y-2.5 pt-1 md:pt-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2.5 sm:gap-3 w-full min-w-0">
          {/* Search Input */}
          <div className="relative flex items-center flex-1 w-full min-w-0">
            <Search className="w-4.5 h-4.5 text-[#8c857b] absolute left-3.5 pointer-events-none stroke-[2.2]" />
            <input
              id="home-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Terrakota, sopol tuvak, tuproq, o'g'it, aroid, orxideya..."
              className="w-full h-11 sm:h-12 pl-10 pr-10 bg-white border border-[#e7e0d3] hover:border-[#b85d3f] focus:border-[#1c3829] focus:bg-white rounded-2xl text-xs sm:text-sm text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-hidden transition-all shadow-2xs"
            />

            {searchQuery && (
              <button
                id="home-clear-search-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Tozalash"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick query pills */}
          <div className="w-full md:w-auto min-w-0 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-[11px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-0.5">
              Ommabop:
            </span>
            {['Barchasi', 'Terrakota', 'Xona gullari', 'Substratlar', 'Dorilar', "O'g'itlar", 'Orxideya', 'Monstera'].map(tag => {
              const isAll = tag === 'Barchasi';
              const isActive = isAll ? !searchQuery : searchQuery.toLowerCase() === tag.toLowerCase();

              return (
                <motion.button
                  key={tag}
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSearchQuery(isAll ? '' : tag === searchQuery ? '' : tag)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer text-[11px] ${
                    isActive
                      ? 'bg-[#1c3829] text-white shadow-xs border border-white/20'
                      : 'glass-pill text-stone-700 hover:text-[#1c1917] hover:bg-white'
                  }`}
                >
                  {tag}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Interactive Search Results View OR Full E-Commerce Discovery */}
      {searchQuery.trim() ? (
        <section id="home-search-results-section" className="space-y-4 pt-1">
          <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-3">
            <div className="text-sm text-stone-700">
              "<strong className="text-stone-900 font-bold">{searchQuery}</strong>" bo'yicha{' '}
              <strong className="text-[#b85d3f] font-bold">{filteredProducts.length}</strong> ta mahsulot topildi
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#1c3829] hover:text-[#284c37] transition-colors cursor-pointer"
            >
              Qidiruvni tozalash
            </motion.button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8">
              <div className="w-12 h-12 rounded-full bg-[#f4efe6] mx-auto flex items-center justify-center text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-base font-bold text-stone-900 font-display">
                "{searchQuery}" bo'yicha hech qanday mahsulot topilmadi
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Boshqa kalit so'z bilan qidirib ko'ring yoki quyidagi mashhur toifalardan birini tanlang.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSearchQuery('')}
                className="mt-2 px-5 py-2.5 bg-[#1c3829] text-white text-xs font-bold rounded-xl hover:bg-[#284c37] transition-all cursor-pointer shadow-xs border border-white/20"
              >
                Barcha mahsulotlarga qaytish
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
              {filteredProducts.map(product => (
                <ProductCard key={`search-${product.id}`} product={product} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 3. Luxury Editorial Hero Carousel & Side Promos */}
          <section id="hero-banner-carousel-section" className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Big Carousel Banner (8 cols) */}
            <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-sm border border-white/40 bg-[#12241a] min-h-[320px] sm:min-h-[380px] flex items-center gpu-layer">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center"
                >
                  {/* Background photo & overlay */}
                  <img
                    src={heroBanners[heroSlide].image}
                    alt={heroBanners[heroSlide].title}
                    className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${heroBanners[heroSlide].bgGradient} opacity-90 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  {/* Banner Content */}
                  <div className="relative z-20 p-6 sm:p-10 max-w-xl space-y-3 sm:space-y-4 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.25 }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 border border-white/30 text-[11px] font-bold tracking-wide uppercase text-[#dfb15b] shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
                      <span>{heroBanners[heroSlide].badge}</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.25 }}
                      className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-white font-display"
                    >
                      {heroBanners[heroSlide].title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.25 }}
                      className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-md line-clamp-2"
                    >
                      {heroBanners[heroSlide].subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.25 }}
                      className="pt-2 flex items-center gap-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={heroBanners[heroSlide].action}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#b85d3f] hover:bg-[#96472f] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer border border-white/30"
                      >
                        <span>{heroBanners[heroSlide].cta}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </motion.button>

                      <div className="hidden min-[480px]:inline-block px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-[11px] font-bold text-[#dfb15b] tracking-wider font-mono">
                        {heroBanners[heroSlide].discount}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Dots Controls */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/30">
                {heroBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroSlide(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === heroSlide ? 'w-6 bg-[#dfb15b]' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Side Promo Cards */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Promo 1 */}
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openCategory('pots-planters')}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#291711] via-[#5c2d1f] to-[#8a3a24] p-5 text-white flex flex-col justify-between border border-[#a44d31]/40 shadow-xs cursor-pointer group min-h-[160px] gpu-layer"
              >
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffd5c7] px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 inline-block">
                    Sara Sopol To'plami
                  </span>
                  <h3 className="text-base font-bold leading-tight font-display pt-1">
                    Terrakota & Sopol Gultuvaklar
                  </h3>
                  <p className="text-[11px] text-[#ffe6dd]/80">35 xil o'lcham va tabiiy mineral ohanglar</p>
                </div>
                <div className="relative z-10 flex items-center text-xs font-bold text-[#dfb15b] group-hover:translate-x-1 transition-transform">
                  <span>To'plamni ko'rish →</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&auto=format&fit=crop&q=80"
                  alt="Tuvaklar"
                  className="absolute right-0 bottom-0 w-32 h-32 object-contain opacity-35 group-hover:opacity-55 group-hover:scale-105 transition-all"
                />
              </motion.div>

              {/* Promo 2 */}
              <motion.div
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate({ type: 'plant_care_guide' })}
                className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#12241a] via-[#1c3829] to-[#294e3b] p-5 text-white flex flex-col justify-between border border-[#2a4e3a] shadow-xs cursor-pointer group min-h-[160px] gpu-layer"
              >
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfb15b] px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 inline-block">
                    Gullar Shifokori
                  </span>
                  <h3 className="text-base font-bold leading-tight font-display pt-1">
                    Fitoterapiya & O'g'itlar Bo'limi
                  </h3>
                  <p className="text-[11px] text-[#eaf2ec]/80">Sariq barglar, zararkunandalar & ildiz davosi</p>
                </div>
                <div className="relative z-10 flex items-center text-xs font-bold text-[#dfb15b] group-hover:translate-x-1 transition-transform">
                  <span>Qo'llanmani o'qish →</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
                  alt="Doctor"
                  className="absolute right-0 bottom-0 w-32 h-32 object-contain opacity-35 group-hover:opacity-55 group-hover:scale-105 transition-all"
                />
              </motion.div>
            </div>
          </section>

          {/* 4. Commercial Trust Bar */}
          <section
            id="trust-and-delivery-section"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 px-4 sm:px-6 glass-card rounded-2xl sm:rounded-3xl"
          >
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#fdf3ef] border border-[#f5d9cf] flex items-center justify-center shrink-0 shadow-2xs">
                <Truck className="w-5 h-5 text-[#b85d3f] stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Termo-xavfsiz yetkazish</h4>
                <p className="text-[10px] text-stone-500">Toshkentda 3 soatda</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#fdf6e7] border border-[#ebd9a9] flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-[#926d1d] stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">14 kunlik to'liq kafolat</h4>
                <p className="text-[10px] text-stone-500">Sifat va salomatlik kafolati</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#eef5f1] border border-[#cbe3d3] flex items-center justify-center shrink-0 shadow-2xs">
                <Droplets className="w-5 h-5 text-[#1c3829] stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Fitoterapevt maslahati</h4>
                <p className="text-[10px] text-stone-500">Mutaxassislardan bepul</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] border border-[#ded8cb] flex items-center justify-center shrink-0 shadow-2xs">
                <HeartHandshake className="w-5 h-5 text-stone-700 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Qabul qilganda to'lov</h4>
                <p className="text-[10px] text-stone-500">Click, Payme, Naqd</p>
              </div>
            </div>
          </section>

          {/* 5. Live Flash Deal Card */}
          {flashSaleProduct && (
            <section
              id="flash-deal-banner-section"
              className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1c3829] via-[#244633] to-[#12241a] text-white p-6 sm:p-8 border border-white/20 shadow-md gpu-layer"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Product Image Pill */}
                <div
                  onClick={() => openProduct(flashSaleProduct.id)}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-white/10 border border-white/30 shrink-0 cursor-pointer group shadow-md"
                >
                  <img
                    src={flashSaleProduct.images[0]}
                    alt={flashSaleProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Deal Info */}
                <div className="space-y-3 text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfb15b]/20 border border-[#dfb15b]/50 text-[#dfb15b] text-xs font-bold">
                    <Flame className="w-4 h-4 fill-[#dfb15b]" />
                    <span>Kunning Maxsus Chegirmasi</span>
                  </div>

                  {/* Isolated Fast Countdown Timer */}
                  <FlashSaleCountdown />

                  <h2
                    onClick={() => openProduct(flashSaleProduct.id)}
                    className="text-lg sm:text-2xl font-bold font-display hover:text-[#dfb15b] transition-colors cursor-pointer"
                  >
                    {flashSaleProduct.name}
                  </h2>
                  <p className="text-xs text-stone-200 leading-relaxed line-clamp-2">
                    {flashSaleProduct.description}
                  </p>

                  <div className="flex items-baseline gap-3 pt-1 justify-center md:justify-start">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#dfb15b] font-price">
                      {formatUZS(flashSaleProduct.price)}
                    </span>
                    {flashSaleProduct.oldPrice && (
                      <span className="text-sm text-stone-300 line-through font-price">
                        {formatUZS(flashSaleProduct.oldPrice)}
                      </span>
                    )}
                    {flashSaleProduct.discountPercent && (
                      <span className="px-2 py-0.5 bg-[#b85d3f] text-white font-bold text-xs rounded-md border border-white/30 font-sans">
                        -{flashSaleProduct.discountPercent}% Chegirma
                      </span>
                    )}
                  </div>
                </div>

                {/* Flash Deal Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(flashSaleProduct, 1);
                      showToast(`"${flashSaleProduct.name}" savatga qo'shildi! 🛒`, 'success');
                    }}
                    className="px-6 py-3 bg-[#dfb15b] hover:bg-[#c59838] text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 border border-white/40"
                  >
                    <span>Savatga qo‘shish</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openProduct(flashSaleProduct.id)}
                    className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl transition-all border border-white/30 cursor-pointer text-center"
                  >
                    Batafsil ko'rish
                  </motion.button>
                </div>
              </div>
            </section>
          )}

          {/* 6. Visual Category Navigation Grid */}
          <section
            ref={categoriesRef}
            id="category-navigation-section"
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1c1917] font-display">
                  Toifalar Bo‘yicha Ko'rish
                </h2>
                <p className="text-xs text-stone-500">Uyingiz va bog‘ingiz uchun tabiiy sopol va o'simliklar</p>
              </div>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate({ type: 'tab', tab: 'catalog' })}
                className="text-xs font-bold text-[#1c3829] hover:text-[#284c37] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Barchasi</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
              {categoryChips.map(chip => (
                <motion.div
                  key={chip.id}
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openCategory(chip.category)}
                  className="group flex flex-col items-center text-center p-2.5 glass-card rounded-2xl cursor-pointer gpu-layer"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-stone-100 mb-2 border border-stone-200 group-hover:scale-105 transition-transform shadow-2xs">
                    <img
                      src={chip.imageUrl}
                      alt={chip.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-800 group-hover:text-[#b85d3f] leading-tight">
                    {chip.label}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {chip.itemCount}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 7. Interactive Discovery Tabs Switcher */}
          <section id="interactive-tabs-section" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e7e0d3] pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1c1917] font-display">
                  Tavsiya Etilgan Mahsulotlar
                </h2>
                <p className="text-xs text-stone-500">Eng yuqori baholangan va xaridorgir saralangan to'plam</p>
              </div>

              {/* Discovery Tabs */}
              <div className="w-full sm:w-auto min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {[
                  { id: 'trending', label: '🔥 Ommabop' },
                  { id: 'new', label: '✨ Yangi kelganlar' },
                  { id: 'pots', label: '🪴 Sopol & Tuvaklar' },
                  { id: 'care', label: '💊 Dori & Substrat' },
                  { id: 'bouquets', label: '💐 Yangi Guldastalar' },
                ].map(tab => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#1c3829] text-white shadow-xs border border-white/20'
                        : 'glass-pill text-stone-700 hover:bg-white'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tab Content Grid */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5"
            >
              {activeTabProducts.map(product => (
                <ProductCard key={`tab-${activeTab}-${product.id}`} product={product} />
              ))}
            </motion.div>
          </section>

          {/* 8. Pots & Planters Dedicated Showcase */}
          {potsAndPlanters.length > 0 && (
            <section id="pots-planters-section" className="space-y-3">
              <SectionHeader
                title="Tabiiy Sopol & Terrakota Tuvaklar"
                subtitle="Pishgan tabiiy loydan yasalgan gultuvaklar, sopol kashpolar va avtosug'orish tizimlari"
                onSeeAll={() => openCategory('pots-planters')}
              />

              <div className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                {potsAndPlanters.map(product => (
                  <ProductCard key={`pots-${product.id}`} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* 9. Soil, Bark & Substrates Showcase */}
          {careAndSoil.length > 0 && (
            <section id="soil-substrates-section" className="space-y-3">
              <SectionHeader
                title="Substratlar & Bio-Fitoterapiya"
                subtitle="Aroid mix, orxideya po'stlog'i, bio-fungitsid, Kornevin va 6 oylik Osmocote"
                onSeeAll={() => openCategory('soil-substrates')}
              />

              <div className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                {careAndSoil.map(product => (
                  <ProductCard key={`soil-${product.id}`} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* 10. Customer Trust & Reviews Grid */}
          <section id="customer-reviews-section" className="p-6 sm:p-8 bg-[#1c3829] text-white rounded-3xl space-y-4 border border-white/15 shadow-md gpu-layer">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-4">
              <div>
                <h3 className="text-base sm:text-xl font-bold font-display text-white">
                  Mijozlarimiz Fikrlari & Sharhlar
                </h3>
                <p className="text-xs text-stone-300">O'zbekiston bo'ylab 15,000 dan ortiq mamnun xaridorlar</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#dfb15b]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#dfb15b]" />
                  ))}
                </div>
                <span className="font-bold text-white text-sm font-mono">4.9 / 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <motion.div
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-serif">Dilnoza K.</span>
                  <span className="text-[10px] text-stone-300 font-mono">Toshkent</span>
                </div>
                <p className="text-stone-200 leading-relaxed font-serif">
                  "Monstera va terrakota tuvagini buyurtma qildim. 2 soatda termo-qutida yetkazib berishdi. O'simlik yaproqlari shudringdek toza va sog'lom!"
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#dfb15b] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tasdiqlangan xaridor</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-serif">Jasur R.</span>
                  <span className="text-[10px] text-stone-300 font-mono">Samarqand</span>
                </div>
                <p className="text-stone-200 leading-relaxed font-serif">
                  "Orxideyalar uchun maxsus po'stloq va Osmocote o'g'itini topa olmayotgan edim. Bu yerda hamma professional dorilar bor ekan, tavsiya qilaman!"
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#dfb15b] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tasdiqlangan xaridor</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-serif">Madina B.</span>
                  <span className="text-[10px] text-stone-300 font-mono">Buxoro</span>
                </div>
                <p className="text-stone-200 leading-relaxed font-serif">
                  "Gullar shifokori bo'limi orqali qanday sug'orishni bilib oldim. Ficusim qayta yangi barglar chiqara boshladi. Ajoyib servis!"
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#dfb15b] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tasdiqlangan xaridor</span>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
