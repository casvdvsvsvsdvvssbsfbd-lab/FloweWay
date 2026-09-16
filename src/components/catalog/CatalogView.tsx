import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, X, ArrowUpDown, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { mockCategories } from '../../data/mockData';
import { FilterOptions, ProductCategory, ProductSize, SortOption, Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { marketplaceService } from '../../services/marketplaceService';

interface CatalogViewProps {
  initialCategory?: ProductCategory;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ initialCategory }) => {
  const { allProducts, setIsAddProductModalOpen } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory || 'all');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Subcategory tag filter
  const [selectedSubTag, setSelectedSubTag] = useState<string>('all');

  // Filters state
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);

  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const availableBrands = Array.from(new Set(allProducts.map(p => p.brand))).filter(
    (b): b is string => Boolean(b)
  );

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filterOptions: FilterOptions = {
      category: selectedCategory,
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      inStockOnly,
      minRating,
      discountedOnly,
      selectedBrands: selectedBrands.length > 0 ? selectedBrands : undefined,
      selectedSizes: selectedSizes.length > 0 ? selectedSizes : undefined,
    };

    marketplaceService.getProducts(filterOptions, sortOption).then(results => {
      if (isMounted) {
        let finalResults = results;
        if (selectedSubTag !== 'all') {
          finalResults = results.filter(p => {
            const text = `${p.name || ''} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
            return selectedSubTag ? text.includes(selectedSubTag.toLowerCase()) : true;
          });
        }
        setDisplayedProducts(finalResults);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, selectedSubTag, sortOption, minPrice, maxPrice, inStockOnly, minRating, discountedOnly, selectedBrands, selectedSizes]);

  const activeFilterCount =
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating ? 1 : 0) +
    (discountedOnly ? 1 : 0) +
    selectedBrands.length +
    selectedSizes.length;

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setMinRating(undefined);
    setDiscountedOnly(false);
    setSelectedBrands([]);
    setSelectedSizes([]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => (prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]));
  };

  // Subcategories mapping
  const subCategoryPills: { id: string; label: string }[] = [
    { id: 'all', label: 'Barchasi' },
    { id: 'monstera', label: 'Monstera' },
    { id: 'fikus', label: 'Fikus' },
    { id: 'orxideya', label: 'Orxideya' },
    { id: 'terrakota', label: 'Terrakota' },
    { id: 'keramika', label: 'Keramika' },
    { id: 'substrat', label: 'Substratlar' },
    { id: 'ogit', label: "O'g'itlar" },
    { id: 'bonsay', label: 'Bonsay' },
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-6 pb-16">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setSelectedCategory('all');
            setSelectedSubTag('all');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer font-serif ${
            selectedCategory === 'all'
              ? 'bg-[#1c3829] text-white shadow-xs border border-white/20'
              : 'glass-pill text-stone-700 hover:text-stone-950'
          }`}
        >
          Barcha toifalar
        </motion.button>

        {mockCategories.map(cat => (
          <motion.button
            key={cat.id}
            id={`cat-pill-${cat.id}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedSubTag('all');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer font-serif ${
              selectedCategory === cat.id
                ? 'bg-[#1c3829] text-white shadow-xs border border-white/20'
                : 'glass-pill text-stone-700 hover:text-stone-950'
            }`}
          >
            {cat.title}
          </motion.button>
        ))}
      </div>

      {/* Subcategory navigation chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
        {subCategoryPills.map(sub => (
          <motion.button
            key={sub.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedSubTag(sub.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer font-serif ${
              selectedSubTag === sub.id
                ? 'bg-[#1c3829]/10 text-[#1c3829] font-bold border border-[#1c3829]/20'
                : 'bg-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {sub.label}
          </motion.button>
        ))}
      </div>

      {/* Control Bar: Sort & Filter */}
      <div className="flex items-center justify-between gap-2.5 pt-1">
        <span className="text-xs text-stone-500 font-medium font-serif">
          <strong className="text-stone-900 font-mono">{displayedProducts.length}</strong> ta mahsulot
        </span>

        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-[#e7e0d3] hover:border-stone-400 rounded-xl px-2.5 py-1.5 text-xs text-stone-900 transition-colors shadow-2xs font-serif">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              id="catalog-sort-dropdown"
              value={sortOption}
              onChange={e => setSortOption(e.target.value as SortOption)}
              className="bg-transparent text-xs font-medium text-stone-900 focus:outline-hidden cursor-pointer"
            >
              <option value="recommended">Tavsiya etilgan</option>
              <option value="newest">Yangi qo'shilganlar</option>
              <option value="price_asc">Narx: Arzondan qimmatga</option>
              <option value="price_desc">Narx: Qimmatdan arzonga</option>
              <option value="highest_rated">Yuqori baholangan</option>
              <option value="biggest_discount">Katta chegirma</option>
            </select>
          </div>

          {/* Filter Button */}
          <motion.button
            id="catalog-filter-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer font-serif ${
              activeFilterCount > 0
                ? 'bg-[#1c3829] text-white border-[#1c3829]'
                : 'bg-white/80 backdrop-blur-md border-[#e7e0d3] text-stone-800 hover:border-[#1c3829]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtr</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#dfb15b] text-stone-950 text-[10px] flex items-center justify-center font-bold font-mono">
                {activeFilterCount}
              </span>
            )}
          </motion.button>

          {/* Sell Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddProductModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#b85d3f] hover:bg-[#96472f] text-white shadow-2xs transition-all cursor-pointer font-serif"
            title="Mahsulotni sotuvga qo'yish"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sotuvga qo‘yish</span>
            <span className="sm:hidden">Sotish</span>
          </motion.button>
        </div>
      </div>

      {/* Active filters pill list */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 flex-wrap text-xs font-serif"
        >
          <span className="text-stone-400 text-[11px]">Faol:</span>
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 bg-[#1c3829]/10 text-[#1c3829] px-2 py-0.5 rounded-md border border-[#1c3829]/20 text-[11px]">
              Mavjudlari
              <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
            </span>
          )}
          {discountedOnly && (
            <span className="inline-flex items-center gap-1 bg-[#b85d3f]/10 text-[#b85d3f] px-2 py-0.5 rounded-md border border-[#b85d3f]/20 text-[11px]">
              Chegirmadagilar
              <X className="w-3 h-3 cursor-pointer" onClick={() => setDiscountedOnly(false)} />
            </span>
          )}
          {minRating && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
              ★ {minRating}+
              <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(undefined)} />
            </span>
          )}
          {selectedBrands.map(b => (
            <span key={b} className="inline-flex items-center gap-1 bg-stone-100 text-stone-900 px-2 py-0.5 rounded-md border border-stone-200 text-[11px]">
              {b}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(b)} />
            </span>
          ))}
          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#1c3829] hover:underline cursor-pointer ml-1 font-semibold"
          >
            Tozalash
          </button>
        </motion.div>
      )}

      {/* Dynamic Product Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-stone-500 font-serif">
          Yuklanmoqda...
        </div>
      ) : displayedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 text-center space-y-2 glass-card rounded-2xl p-6"
        >
          <p className="text-xs sm:text-sm font-semibold text-stone-900 font-display">Mahsulot topilmadi</p>
          <p className="text-[11px] text-stone-500 font-serif">Filtrlarni tozalab ko'ring yoki boshqa toifani tanlang.</p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetFilters}
            className="px-4 py-1.5 bg-[#1c3829] text-white text-xs font-semibold rounded-xl hover:bg-[#284c37] shadow-xs cursor-pointer font-serif"
          >
            Filtrlarni bekor qilish
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5"
        >
          {displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}

      {/* Filter Modal with AnimatePresence and Spring */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#fcfaf6] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#e7e0d3] space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e0d3]">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">Mahsulotlarni Filtrlash</h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full cursor-pointer hover:bg-stone-200/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-serif">
                  Narx oralig'i (so'm)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min narx"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-[#e7e0d3] text-xs text-stone-900 focus:outline-hidden focus:border-[#1c3829]"
                  />
                  <input
                    type="number"
                    placeholder="Max narx"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-[#e7e0d3] text-xs text-stone-900 focus:outline-hidden focus:border-[#1c3829]"
                  />
                </div>
              </div>

              {/* Availability & Sale */}
              <div className="space-y-2.5 pt-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-900 block font-serif">
                  Mavjudlik va chegirmalar
                </label>
                <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer font-serif">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="rounded text-[#1c3829] focus:ring-0 cursor-pointer"
                  />
                  <span>Faqat omborda mavjudlari</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer font-serif">
                  <input
                    type="checkbox"
                    checked={discountedOnly}
                    onChange={e => setDiscountedOnly(e.target.checked)}
                    className="rounded text-[#1c3829] focus:ring-0 cursor-pointer"
                  />
                  <span>Faqat chegirmadagi mahsulotlar</span>
                </label>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-900 block font-serif">
                  Mijozlar bahosi
                </label>
                <div className="flex gap-2">
                  {[4, 4.5, 4.8].map(r => (
                    <motion.button
                      key={r}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMinRating(minRating === r ? undefined : r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer font-serif ${
                        minRating === r
                          ? 'bg-[#1c3829] text-white border-[#1c3829]'
                          : 'bg-white text-stone-800 border-[#e7e0d3] hover:border-[#1c3829]'
                      }`}
                    >
                      ★ {r}+
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-900 block font-serif">
                    Brend / Ishlab chiqaruvchi
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableBrands.map(b => (
                      <motion.button
                        key={b}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleBrand(b)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer font-serif ${
                          selectedBrands.includes(b)
                            ? 'bg-[#1c3829] text-white border-[#1c3829]'
                            : 'bg-white text-stone-800 border-[#e7e0d3] hover:border-[#1c3829]'
                        }`}
                      >
                        {b}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-[#e7e0d3]">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetFilters}
                  className="flex-1 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 font-serif cursor-pointer"
                >
                  Tozalash
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#1c3829] hover:bg-[#284c37] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer font-serif"
                >
                  Filtrlarni qo'llash
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
