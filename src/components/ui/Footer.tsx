import React from 'react';
import { Sprout, Truck, ShieldCheck, Send, Droplets, Sparkles, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate, openCategory } = useApp();

  return (
    <footer className="w-full bg-[#12241a] border-t border-[#2a4e3a] pt-14 pb-16 mt-16 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-[#223f2f]">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1c3829] border border-[#2a4e3a] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#dfb15b] stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">Termo-quti • 3 Soatda Yetkazish</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed font-serif">
                Toshkent va barcha viloyatlar bo'ylab o'simliklar harorat nazorati ostida maxsus termo-qutilarda yetkaziladi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1c3829] border border-[#2a4e3a] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#dfb15b] stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">14 Kunlik To'liq Kafolat</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed font-serif">
                Har bir gul va tuvak sifat tekshiruvidan o'tadi. Zararlangan taqdirda darhol bepul almashtirib beriladi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1c3829] border border-[#2a4e3a] flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-[#dfb15b] stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-serif">O'simliklar Shifokori Maslahati</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed font-serif">
                Tajribali agronom va botaniklar tomonidan bepul sug'orish, tuproq tanlash va davolash konsultatsiyasi.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Brand Col (2 cols on md) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#b85d3f] text-white flex items-center justify-center shadow-sm">
                <Sprout className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight font-display">FlowerWay</span>
                <span className="block text-[10px] text-[#dfb15b] font-sans uppercase tracking-widest -mt-0.5">Gullar & O'simliklar Bozori</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-sans">
              O'zbekistondagi eng yirik tirik gullar, terrakota tuvaklar va bog'dorchilik mahsulotlari bozori. Sog'lom xona o'simliklari, professional substratlar va biologik oziqlar.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => window.open('https://t.me/flowerway_support', '_blank')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1c3829] hover:bg-[#284c37] border border-[#2a4e3a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer font-sans"
              >
                <Send className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Telegram Maslahat</span>
              </button>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif text-[#dfb15b]">Kategoriyalar</h5>
            <ul className="space-y-2 text-stone-400 font-serif">
              <li>
                <button
                  onClick={() => openCategory('live-plants')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Xona O'simliklari
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('bouquets')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Guldastalar & Sovg'alar
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('orchids')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nodir Orxideyalar
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('exotic-plants')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ekzotik & Katta Gullar
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('pots-planters')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terrakota & Sopol Tuvaklar
                </button>
              </li>
            </ul>
          </div>

          {/* Plant Care & Guides */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif text-[#dfb15b]">Gullar Parvarishi</h5>
            <ul className="space-y-2 text-stone-400 font-serif">
              <li>
                <button
                  onClick={() => navigate({ type: 'plant_care_guide' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Gullar Shifokori & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('soil-substrates')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Aroid & Orxideya Tuproqlari
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('fertilizers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Osmocote & Organik O'g'itlar
                </button>
              </li>
              <li>
                <button
                  onClick={() => openCategory('plant-medicine')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Fungitsid & Ildiz Dorilari
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Delivery */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-serif text-[#dfb15b]">Mijozlarga Xizmat</h5>
            <ul className="space-y-2 text-stone-400 font-serif">
              <li>
                <button
                  onClick={() => navigate({ type: 'tab', tab: 'cart' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Yetkazib Berish Xaritasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'tab', tab: 'profile' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Buyurtmani Kuzatish
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ type: 'favorites' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sevimlilar Ro'yxati
                </button>
              </li>
              <li className="text-stone-400">Har kuni 09:00 — 22:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Payments & Copyright */}
        <div className="pt-8 border-t border-[#223f2f] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-sans">
          <div>
            © 2026 FlowerWay LLC. Barcha huquqlar himoyalangan.
          </div>

          {/* Payment Methods Badges */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold text-stone-200">
            <span className="px-2.5 py-1 bg-[#1c3829] border border-[#2a4e3a] rounded-md">Payme</span>
            <span className="px-2.5 py-1 bg-[#1c3829] border border-[#2a4e3a] rounded-md">Click</span>
            <span className="px-2.5 py-1 bg-[#1c3829] border border-[#2a4e3a] rounded-md">Uzum Pay</span>
            <span className="px-2.5 py-1 bg-[#1c3829] border border-[#2a4e3a] rounded-md">Uzcard / Humo</span>
            <span className="px-2.5 py-1 bg-[#1c3829] border border-[#2a4e3a] rounded-md">Qabul Qilganda Naqd</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
