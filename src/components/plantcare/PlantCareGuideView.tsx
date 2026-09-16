import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  ShieldAlert,
  Sparkles,
  Sun,
  Thermometer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatUZS } from '../../utils/formatters';

interface PlantIssue {
  id: string;
  symptom: string;
  cause: string;
  solution: string;
  recommendedProductIds: string[];
}

export const PlantCareGuideView: React.FC = () => {
  const { goBack, allProducts, addToCart, showToast, openProduct } = useApp();
  const [selectedIssue, setSelectedIssue] = useState<string>('yellow-leaves');

  const plantIssues: PlantIssue[] = [
    {
      id: 'yellow-leaves',
      symptom: "Barglarning sarg'ayishi va to'kilishi",
      cause: "Ko'pincha me'yoridan ortiq sug'orish yoki tuproqda drenaj yetishmasligi (ildiz dimlanishi), yoxud temir (xloroz) yetishmovchiligi.",
      solution: "Sug'orish rejimini kamaytiring. Tuproqning yuqori 2-3 sm qismi qurishini kuting. Temir xelati yoki kompleks mikroelementli o'g'it bering.",
      recommendedProductIds: ['prod-fertilizer-ficus-500', 'prod-soil-aroid-mix'],
    },
    {
      id: 'brown-tips',
      symptom: "Barg uchlarining qurishi va qorayishi",
      cause: "O'zbekistonning quruq iqlimi, ayniqsa qishki isitish mavsumida havoning haddan tashqari quruqligi (namlik < 30%).",
      solution: "O'simlik yoniga havo namlagich (humidifier) qo'ying yoki haftasiga 2-3 marta purkagich (pulverizator) bilan iliq suv seping.",
      recommendedProductIds: ['prod-spray-sprayer-15l'],
    },
    {
      id: 'spider-mites',
      symptom: "Mayda oq nuqtalar, to'r (pautina) va barglarning xiralashishi",
      cause: "O'rgimchak kanasi (Pautinniy klesh) — quruq va issiq havoda tez ko'payuvchi xavfli zararkunanda.",
      solution: "O'simlikni dush ostida yuvib oling va darhol Fitoverm yoki Aktofit bio-insektoakaritsidi bilan 2 marta 5 kun oralig'ida ishlov bering.",
      recommendedProductIds: ['prod-medicine-fitoverm-50'],
    },
    {
      id: 'fungus-rot',
      symptom: "Ildiz chirishi, tuproqda oq mog'or yoki zamburug' hidi",
      cause: "Haddan tashqari nam tuproq, sovuq deraza tokchasi va zamburug'li infeksiya.",
      solution: "Sug'orishni to'xtating. Fitosporin-M biofungitsidi bilan tuproqni va barglarni sug'orib chiqing.",
      recommendedProductIds: ['prod-medicine-fitosporin-100', 'prod-pruner-gardena'],
    },
  ];

  const activeIssueData = plantIssues.find(i => i.id === selectedIssue) || plantIssues[0];

  const recommendedProducts = allProducts.filter(p =>
    activeIssueData.recommendedProductIds.includes(p.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-28 space-y-5 max-w-4xl mx-auto font-serif"
    >
      {/* Top Bar */}
      <div className="pt-2 flex items-center justify-between">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={goBack}
          className="text-xs font-semibold text-stone-600 flex items-center gap-1 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga</span>
        </motion.button>
        <span className="text-xs font-bold text-[#1c3829] uppercase tracking-wide font-display">
          O'simliklar Shifokori 🌿
        </span>
      </div>

      {/* Hero Banner */}
      <div>
        <div className="bg-gradient-to-br from-[#1c3829] via-[#284c37] to-[#12241a] text-white rounded-3xl p-5 sm:p-6 shadow-xs space-y-2 border border-white/10">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-amber-200">
            <Sparkles className="w-3 h-3 text-[#dfb15b]" />
            <span>AI Diagnostika & Maslahat</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold leading-tight font-display">
            Gulingiz kasallandi yoki so'lyaptimi?
          </h1>
          <p className="text-xs text-stone-300">
            Alomatni tanlang — biz sababini va O'zbekiston iqlimiga mos eng samarali dorilarni tavsiya qilamiz.
          </p>
        </div>
      </div>

      {/* Issue Selector Pills */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wide font-display">
          Alomatni tanlang (Symptom Checker)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {plantIssues.map(issue => {
            const isSelected = selectedIssue === issue.id;
            return (
              <motion.button
                key={issue.id}
                id={`issue-btn-${issue.id}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedIssue(issue.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c3829]/10 border-[#1c3829] shadow-2xs'
                    : 'glass-card hover:border-stone-400'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#1c3829] text-white' : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 leading-snug">{issue.symptom}</h4>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Result Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIssue}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="glass-card rounded-3xl p-5 sm:p-6 space-y-3.5"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#1c3829] uppercase tracking-wider bg-[#1c3829]/10 px-2.5 py-0.5 rounded-md border border-[#1c3829]/20">
              Tashxis natijasi
            </span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-1 font-display">
              {activeIssueData.symptom}
            </h3>
          </div>

          <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-[#e7e0d3] text-xs space-y-1">
            <span className="font-bold text-stone-800">Ehtimoliy sabab:</span>
            <p className="text-stone-600 leading-relaxed">{activeIssueData.cause}</p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 text-xs space-y-1">
            <span className="font-bold text-[#1c3829]">Davolash choralari:</span>
            <p className="text-[#1c3829]/90 leading-relaxed">{activeIssueData.solution}</p>
          </div>

          {/* Recommended Medicines / Fertilizers */}
          {recommendedProducts.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-[#e7e0d3]">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 font-display">
                <Sparkles className="w-4 h-4 text-[#1c3829]" />
                <span>Ushbu holat uchun zarur preparatlar:</span>
              </h4>

              <div className="space-y-2">
                {recommendedProducts.map(p => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl border border-[#e7e0d3] bg-white/70 backdrop-blur-xs flex items-center justify-between gap-2 hover:border-[#1c3829] transition-colors"
                  >
                    <div
                      onClick={() => openProduct(p.id)}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer"
                    >
                      <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded-xl bg-white shrink-0 border border-[#e7e0d3]" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-stone-900 truncate block">{p.name}</span>
                        <span className="text-[11px] font-extrabold text-[#1c3829] font-mono">{formatUZS(p.price)}</span>
                      </div>
                    </div>

                    <motion.button
                      id={`doctor-add-cart-${p.id}`}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => {
                        addToCart(p, 1);
                        showToast(`"${p.name}" savatga qo'shildi! 🛒`, 'success');
                      }}
                      className="px-3 py-1.5 bg-[#1c3829] hover:bg-[#284c37] text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Savatga</span>
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Uzbekistan Seasonal Climate Guide */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wide font-display">
          O'zbekiston Iqlimi Uchun Mavsumiy Eslatmalar
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 glass-card rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-600">
              <Sun className="w-4 h-4" />
              <span>Yozgi jazirama (Iyun — Avgust)</span>
            </div>
            <p className="text-stone-600">
              To'g'ridan-to'g'ri quyosh nurlaridan panalang (tush paytida derazani yoping yoki yengil tull parda tuting). Har kuni kechki payt barglarni purkash tavsiya etiladi.
            </p>
          </div>

          <div className="p-3.5 glass-card rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-600">
              <Thermometer className="w-4 h-4" />
              <span>Qishki isitish mavsumi (Noyabr — Fevral)</span>
            </div>
            <p className="text-stone-600">
              Gullarni isitish batareyalaridan kamida 1.5 metr uzoqda saqlang. Sug'orish chastotasini kamaytiring, chunki qishda o'simliklar tinish davriga o'tadi.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
