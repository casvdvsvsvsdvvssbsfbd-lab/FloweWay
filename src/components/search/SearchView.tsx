import React, { useEffect, useState } from 'react';
import { Search, X, Clock, TrendingUp, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockCategories } from '../../data/mockData';
import { Product, SortOption } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';
import { ProductCard } from '../common/ProductCard';
import { useApp } from '../../context/AppContext';

export const SearchView: React.FC = () => {
  const { openCategory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Monstera Variegata',
    'Oq orxideya',
    'Terrakota tuvak',
    'Ficus Lyrata',
    "Osmocote o'g'iti",
  ]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');

  const [selectedCatFilter] = useState<string>('all');

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delay = setTimeout(() => {
      marketplaceService
        .getProducts({
          searchQuery: searchQuery.trim(),
          category: selectedCatFilter !== 'all' ? (selectedCatFilter as any) : undefined,
        }, sortOption)
        .then(products => {
          setSearchResults(products);
          setIsSearching(false);
        });
    }, 150);

    return () => clearTimeout(delay);
  }, [searchQuery, selectedCatFilter, sortOption]);

  const handleSelectQuery = (q: string) => {
    setSearchQuery(q);
    if (!recentSearches.includes(q)) {
      setRecentSearches(prev => [q, ...prev.slice(0, 5)]);
    }
  };

  const handleClearQuery = () => {
    setSearchQuery('');
  };

  const handleRemoveRecent = (item: string) => {
    setRecentSearches(prev => prev.filter(s => s !== item));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 pb-16">
      {/* Search field at top */}
      <div className="max-w-2xl mx-auto space-y-2.5">
        <div className="relative flex items-center">
          <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 pointer-events-none stroke-[2]" />
          <input
            id="search-view-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="O'simliklar, guldastalar, sopol tuvaklar qidirish..."
            className="w-full h-11 sm:h-12 pl-10 pr-10 bg-white/90 backdrop-blur-md border border-[#e7e0d3] hover:border-[#b85d3f] focus:border-[#1c3829] focus:bg-white rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden transition-all shadow-xs"
            autoFocus
          />
          {searchQuery && (
            <motion.button
              id="clear-search-view-btn"
              whileTap={{ scale: 0.9 }}
              onClick={handleClearQuery}
              className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Quick query suggestion pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] -mx-4 px-4 sm:mx-0 sm:px-0">
          {['Gultuvak', 'Tuproq', 'Dori', "O'g'it", 'Sekator', 'Monstera', 'Orxideya', 'Atirgullar', 'Bonsay', 'Fikus'].map(term => (
            <motion.button
              key={term}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => handleSelectQuery(term)}
              className="px-3 py-1 glass-pill text-stone-700 hover:text-[#1c3829] rounded-xl shrink-0 font-medium transition-colors cursor-pointer font-serif"
            >
              {term}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {!searchQuery.trim() ? (
        <div className="max-w-3xl mx-auto space-y-6 pt-2">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 font-serif">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Oxirgi qidiruvlar</span>
                </div>
                <button
                  onClick={handleClearAllRecent}
                  className="text-[11px] text-stone-400 hover:text-stone-900 font-serif cursor-pointer"
                >
                  Tozalash
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map(item => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-xl text-xs text-stone-800 transition-colors cursor-pointer font-serif"
                    onClick={() => handleSelectQuery(item)}
                  >
                    <span>{item}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveRecent(item);
                      }}
                      className="text-stone-400 hover:text-stone-800 p-0.5 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Botanical Categories */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400 font-serif">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ommabop toifalar</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {mockCategories.slice(0, 6).map(cat => (
                <motion.button
                  key={cat.id}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openCategory(cat.id)}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl glass-card text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-[#e7e0d3]">
                    <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 leading-tight font-serif">{cat.title}</div>
                    <div className="text-[10px] text-stone-400 font-serif">{cat.itemCount} ta mahsulot</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Search Results View */
        <div className="space-y-3 pt-1">
          {/* Results Bar & Sort */}
          <div className="flex items-center justify-between border-b border-[#e7e0d3] pb-2 font-serif">
            <div className="text-xs text-stone-600">
              "<strong className="text-stone-900">{searchQuery}</strong>" bo'yicha{' '}
              <strong className="text-[#b85d3f] font-mono">{searchResults.length}</strong> ta natija
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-[#e7e0d3] rounded-xl px-2.5 py-1 text-xs text-stone-900 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-xs font-medium text-stone-900 focus:outline-hidden cursor-pointer"
              >
                <option value="recommended">Tavsiya</option>
                <option value="popular">Ommabop</option>
                <option value="price_asc">Arzondan</option>
                <option value="price_desc">Qimmatdan</option>
                <option value="newest">Yangi</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {isSearching ? (
            <div className="py-12 text-center text-xs text-stone-500 font-serif">
              Qidirilmoqda...
            </div>
          ) : searchResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-2 glass-card rounded-2xl p-6"
            >
              <p className="text-xs sm:text-sm font-semibold text-stone-900 font-display">"{searchQuery}" bo'yicha mahsulot topilmadi</p>
              <p className="text-[11px] text-stone-500 font-serif">Boshqa so'z bilan qidirib ko'ring (masalan, Monstera, Orxideya, Sopol tuvak).</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5"
            >
              {searchResults.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
