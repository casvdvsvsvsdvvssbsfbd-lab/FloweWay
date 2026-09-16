import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ChevronLeft,
  Sparkles,
  Sun,
  Droplets,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  X,
  BookMarked,
  Info,
  Clock,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockEncyclopediaPlants, mockEncyclopediaArticles } from '../../data/encyclopediaData';
import { PlantEncyclopediaItem, EncyclopediaArticle } from '../../types';
import { useApp } from '../../context/AppContext';

export const PlantEncyclopediaView: React.FC = () => {
  const { goBack, openProduct, navigate } = useApp();
  const [activeMainTab, setActiveMainTab] = useState<'plants' | 'articles'>('plants');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedPlant, setSelectedPlant] = useState<PlantEncyclopediaItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<EncyclopediaArticle | null>(null);

  // Filtered Plants
  const filteredPlants = useMemo(() => {
    return mockEncyclopediaPlants.filter(plant => {
      const matchesSearch =
        !searchQuery.trim() ||
        plant.uzbekName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.latinName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (plant.russianName && plant.russianName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        plant.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedTag === 'all') return true;
      if (selectedTag === 'heat' && plant.heatResistant) return true;
      if (selectedTag === 'pet' && plant.petSafe) return true;
      if (selectedTag === 'low_light' && plant.lowLightTolerant) return true;
      if (selectedTag === 'drought' && plant.droughtTolerant) return true;
      if (selectedTag === 'air' && plant.airPurifying) return true;
      return true;
    });
  }, [searchQuery, selectedTag]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 font-serif">
      {/* 1. Header with Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e0d3] pb-4">
        <div>
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ortga</span>
          </motion.button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1c3829] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-[#dfb15b]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1917] font-display">
                O'simliklar Ensiklopediyasi
              </h1>
              <p className="text-xs text-stone-500 font-serif">
                O'zbekiston iqlimi uchun moslashtirilgan ilmiy va amaliy parvarish qo'llanmalari
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-[#e7e0d3] self-start sm:self-center">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveMainTab('plants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'plants'
                ? 'bg-white text-[#1c3829] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🪴 O'simliklar Dossyesi</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveMainTab('articles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'articles'
                ? 'bg-white text-[#1c3829] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>📖 Foydali Maqolalar</span>
          </motion.button>
        </div>
      </div>

      {activeMainTab === 'plants' ? (
        /* PLANTS DOSSIER TAB */
        <div className="space-y-5">
          {/* Search and Tags Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="O'simlik nomi (Monstera, Fikus, Sansevyeriya, Orxideya...)"
                className="w-full h-11 pl-10 pr-10 bg-white border border-[#e7e0d3] rounded-2xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#1c3829] shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Climate & Trait Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: 'all', label: "Barchasi" },
                { id: 'heat', label: "☀️ 40°C Jaziramaga chidamli" },
                { id: 'low_light', label: "💡 Kam yorug'likda o'suvchi" },
                { id: 'drought', label: "💧 Kam sug'oriladigan" },
                { id: 'air', label: "💨 Havoni 95% tozalovchi" },
                { id: 'pet', label: "🐾 Uy hayvonlariga xavfsiz" },
              ].map(tag => (
                <motion.button
                  key={tag.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedTag === tag.id
                      ? 'bg-[#1c3829] text-white shadow-xs border border-white/20'
                      : 'bg-white border border-[#e7e0d3] text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {tag.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Plant Dossier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlants.map(plant => (
              <motion.div
                key={plant.id}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                onClick={() => setSelectedPlant(plant)}
                className="bg-white rounded-3xl border border-[#e7e0d3] hover:border-[#b85d3f]/60 hover:shadow-md transition-all p-4 flex flex-col justify-between gap-3 cursor-pointer group gpu-layer"
              >
                <div className="space-y-3">
                  <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src={plant.imageUrl}
                      alt={plant.uzbekName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                        {plant.difficulty}
                      </span>
                      {plant.heatResistant && (
                        <span className="px-2 py-0.5 rounded-md bg-[#b85d3f] text-white text-[10px]">
                          ☀️ Jaziramaga mos
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-stone-400 tracking-wider uppercase">
                      {plant.category}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#b85d3f] transition-colors leading-tight font-display">
                      {plant.uzbekName}
                    </h3>
                    <p className="text-[11px] text-stone-500 italic mt-0.5 font-sans">
                      {plant.latinName}
                    </p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {plant.shortSummary}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#1c3829] group-hover:text-[#b85d3f]">
                  <span>To'liq parvarish qoidalari →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* ARTICLES TAB */
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockEncyclopediaArticles.map(article => (
              <motion.article
                key={article.id}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-3xl border border-[#e7e0d3] hover:border-[#b85d3f]/60 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer group gpu-layer"
              >
                <div className="relative aspect-16/9 w-full bg-stone-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#1c3829] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {article.category}
                  </div>
                </div>

                <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#b85d3f] transition-colors leading-tight font-display">
                      {article.title}
                    </h2>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      Muallif: <strong className="text-stone-800">{article.author}</strong>
                    </span>
                    <span className="text-xs font-bold text-[#1c3829] group-hover:text-[#b85d3f]">
                      O'qish →
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* PLANT DOSSIER FULL MODAL */}
      <AnimatePresence>
        {selectedPlant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#fcfaf6] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-[#e7e0d3] space-y-6 relative"
            >
              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPlant(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:text-stone-950 flex items-center justify-center cursor-pointer border border-stone-200 z-10"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Plant Hero Header */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-44 aspect-square rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-sm">
                  <img
                    src={selectedPlant.imageUrl}
                    alt={selectedPlant.uzbekName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5 flex-1 pr-6">
                  <span className="text-[10px] font-bold text-[#b85d3f] uppercase tracking-wider">
                    {selectedPlant.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight font-display">
                    {selectedPlant.uzbekName}
                  </h2>
                  <p className="text-xs text-stone-500 italic font-sans">{selectedPlant.latinName}</p>
                  <p className="text-xs text-stone-700 leading-relaxed pt-1">
                    {selectedPlant.shortSummary}
                  </p>
                </div>
              </div>

              {/* Special Uzbekistan Climate Notice Box */}
              <div className="p-4 rounded-2xl bg-[#fdf6e7] border border-[#ebd9a9] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#926d1d]">
                  <Flame className="w-4 h-4 fill-[#926d1d]" />
                  <span>O'zbekiston Iqlimi Bo'yicha Maxsus Maslahat:</span>
                </div>
                <p className="text-xs text-[#5c4412] leading-relaxed">
                  {selectedPlant.uzbekistanClimateTips}
                </p>
              </div>

              {/* Care Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-[#e7e0d3] space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">☀️ Yozgi sug'orish</span>
                  <p className="font-semibold text-stone-900">{selectedPlant.wateringSummer}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#e7e0d3] space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">❄️ Qishki sug'orish</span>
                  <p className="font-semibold text-stone-900">{selectedPlant.wateringWinter}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#e7e0d3] space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">💡 Yorug'lik</span>
                  <p className="font-semibold text-stone-900">{selectedPlant.lightRequirements}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#e7e0d3] space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">🪴 Tavsiya Tuvak</span>
                  <p className="font-semibold text-stone-900">{selectedPlant.recommendedPot}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#e7e0d3] space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">🌱 Tuproq turi</span>
                  <p className="font-semibold text-stone-900">{selectedPlant.soilRecommendation}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#e7e0d3] space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase">🐾 Uy hayvonlariga</span>
                  <p className="font-semibold text-stone-900">
                    {selectedPlant.petSafe ? '✅ Mutlaqo xavfsiz' : '⚠️ Ehtiyot bo‘lish kerak'}
                  </p>
                </div>
              </div>

              {/* Common Problems & Solutions */}
              {selectedPlant.commonProblems.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <h4 className="text-sm font-bold text-stone-900 font-display">
                    Tez-tez uchraydigan muammolar va davosi:
                  </h4>
                  <div className="space-y-2">
                    {selectedPlant.commonProblems.map((prob, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white border border-[#e7e0d3] text-xs space-y-1">
                        <div className="font-bold text-[#b85d3f]">❓ {prob.symptom}</div>
                        <div className="text-stone-700">💡 <strong>Davolash:</strong> {prob.solution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                {selectedPlant.associatedProductId ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const pid = selectedPlant.associatedProductId!;
                      setSelectedPlant(null);
                      openProduct(pid);
                    }}
                    className="flex-1 py-3 bg-[#1c3829] hover:bg-[#284c37] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#dfb15b]" />
                    <span>Do'kondan xarid qilish</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      setSelectedPlant(null);
                      navigate({ type: 'tab', tab: 'catalog' });
                    }}
                    className="flex-1 py-3 bg-[#1c3829] hover:bg-[#284c37] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Katalogda ko'rish</span>
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPlant(null)}
                  className="px-5 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
                >
                  Yopish
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ARTICLE READER FULL MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#fcfaf6] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-[#e7e0d3] space-y-6 relative"
            >
              {/* Close Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:text-stone-950 flex items-center justify-center cursor-pointer border border-stone-200 z-10"
              >
                <X className="w-4 h-4" />
              </motion.button>

              <div className="space-y-4">
                <div className="space-y-1 pr-6">
                  <span className="text-[10px] font-bold text-[#1c3829] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#eef5f1] border border-[#cbe3d3]">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight font-display pt-1">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
                    <span>{selectedArticle.author}</span>
                    <span>•</span>
                    <span>{selectedArticle.date}</span>
                    <span>•</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>
                </div>

                <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
                  {selectedArticle.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Key Tips Box */}
                {selectedArticle.tips.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#eef5f1] border border-[#cbe3d3] space-y-2">
                    <h4 className="text-xs font-bold text-[#1c3829] uppercase tracking-wider">
                      💡 Mutaxassisning Oltin Maslahatlari:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#1c3829]">
                      {selectedArticle.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1c3829] text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Tushunarli
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
