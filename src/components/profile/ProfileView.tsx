import React, { useState } from 'react';
import {
  ChevronRight,
  Gift,
  Heart,
  HelpCircle,
  MapPin,
  Package,
  Send,
  Plus,
  Trash2,
  ShieldCheck,
  Store,
  PlusCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatUZS, formatDateTime } from '../../utils/formatters';
import { ProductCard } from '../common/ProductCard';
import { UzbekistanRegion } from '../../types';
import { UZBEKISTAN_REGIONS } from '../../data/mockData';

interface ProfileViewProps {
  onOpenTelegramModal?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenTelegramModal }) => {
  const {
    userProfile,
    orders,
    favoriteIds,
    allProducts,
    navigate,
    addresses,
    addAddress,
    deleteAddress,
    showToast,
    setIsAddProductModalOpen,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'favorites' | 'addresses'>('overview');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Address modal form
  const [newTitle, setNewTitle] = useState('Uyim');
  const [newRegion, setNewRegion] = useState<UzbekistanRegion>('Toshkent shahri');
  const [newCity, setNewCity] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');

  const favoriteProducts = allProducts.filter(p => favoriteIds.includes(p.id));

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity || !newStreet) {
      showToast('Shahar va ko‘cha manzilini to‘ldiring', 'error');
      return;
    }

    await addAddress({
      title: newTitle,
      region: newRegion,
      cityDistrict: newCity,
      streetAddress: newStreet,
      apartment: newApartment,
      isDefault: addresses.length === 0,
    });

    setShowAddAddressModal(false);
    showToast('Yetkazish manzili saqlandi! 📍', 'success');
    setNewCity('');
    setNewStreet('');
    setNewApartment('');
  };

  const handleDeleteAddress = async (id: string) => {
    await deleteAddress(id);
    showToast('Manzil o‘chirildi', 'info');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 pb-16">
      {/* Profile Header Block */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl glass-card"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#1c3829] text-[#f7f2ea] flex items-center justify-center text-lg font-bold shadow-xs border border-white/20 font-display">
            {userProfile.fullName ? userProfile.fullName.charAt(0) : 'U'}
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-stone-900 font-display">
              {userProfile.fullName}
            </h1>
            <p className="text-xs text-stone-500 font-serif">
              {userProfile.phoneNumber} {userProfile.telegramUsername ? `• @${userProfile.telegramUsername}` : ''}
            </p>
          </div>
        </div>

        {/* Loyalty Bonus Pill */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-amber-50/80 rounded-2xl border border-amber-200/80 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider font-serif">
              Bonus Balans
            </div>
            <div className="text-xs sm:text-sm font-black text-stone-900 font-mono">
              {formatUZS(userProfile.bonusPoints)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e7e0d3] gap-3 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto pb-0.5 scrollbar-none font-serif">
        {[
          { id: 'overview', label: "Umumiy ma'lumot" },
          { id: 'orders', label: `Buyurtmalar (${orders.length})` },
          { id: 'favorites', label: `Saralanganlar (${favoriteIds.length})` },
          { id: 'addresses', label: `Manzillar (${addresses.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`pb-2.5 transition-colors border-b-2 cursor-pointer shrink-0 ${
              activeSection === tab.id
                ? 'border-[#1c3829] text-[#1c3829] font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-4 font-serif">
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection('orders')}
                  className="p-3.5 sm:p-4 glass-card rounded-2xl cursor-pointer transition-all"
                >
                  <Package className="w-4.5 h-4.5 text-[#1c3829] mb-2" />
                  <div className="text-lg font-bold text-stone-900 font-mono">{orders.length}</div>
                  <div className="text-xs text-stone-500">Jami buyurtmalar</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection('favorites')}
                  className="p-3.5 sm:p-4 glass-card rounded-2xl cursor-pointer transition-all"
                >
                  <Heart className="w-4.5 h-4.5 text-[#b85d3f] mb-2" />
                  <div className="text-lg font-bold text-stone-900 font-mono">{favoriteIds.length}</div>
                  <div className="text-xs text-stone-500">Saqlangan o'simliklar</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection('addresses')}
                  className="p-3.5 sm:p-4 glass-card rounded-2xl cursor-pointer transition-all col-span-2 sm:col-span-1"
                >
                  <MapPin className="w-4.5 h-4.5 text-[#1c3829] mb-2" />
                  <div className="text-lg font-bold text-stone-900 font-mono">{addresses.length}</div>
                  <div className="text-xs text-stone-500">Yetkazish manzillari</div>
                </motion.div>
              </div>

              {/* Seller / Vendor Listing Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#1c3829] to-[#284c37] text-white shadow-xs space-y-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <Store className="w-4.5 h-4.5 text-[#f7f2ea]" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white font-display">Sotuvchi bo‘limi (Marketplace)</h3>
                      <p className="text-[11px] text-[#e7e0d3]">Gultuvaklar, tuproq, o‘g‘it, dori va gullarni sotuvga qo‘ying</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="px-3.5 py-2 bg-white text-[#1c3829] hover:bg-[#fcfaf6] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 font-serif"
                  >
                    <PlusCircle className="w-4 h-4 text-[#b85d3f]" />
                    <span>E'lon berish</span>
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-[#e7e0d3]">
                  <span className="px-2 py-0.5 bg-white/10 rounded-lg">🪴 Gultuvaklar</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-lg">🪨 Tuproq & Torf</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-lg">💊 Dorilar</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-lg">🧪 O‘g‘itlar</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-lg">🌿 Xona gullari</span>
                </div>
              </div>

              {/* Quick Menu List */}
              <div className="rounded-3xl glass-card divide-y divide-[#e7e0d3] text-xs sm:text-sm font-medium overflow-hidden">
                <div
                  onClick={() => navigate({ type: 'encyclopedia' })}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">📖</span>
                    <div>
                      <span className="text-stone-900 font-bold">O'simliklar Ensiklopediyasi & Maqolalar</span>
                      <div className="text-[11px] text-stone-500">O'zbekiston iqlimi bo'yicha parvarish qo'llanmalari</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>

                <div
                  onClick={() => onOpenTelegramModal?.()}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0088cc] text-white flex items-center justify-center">
                      <Send className="w-3 h-3 -rotate-45" />
                    </div>
                    <div>
                      <span className="text-stone-900 font-bold">Telegram Bot Xabarnomalari</span>
                      <div className="text-[11px] text-stone-500">Buyurtma va to'lov kvitansiyasini Telegramda kuzatish</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>

                <div
                  onClick={() => navigate({ type: 'plant_care_guide' })}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4.5 h-4.5 text-[#1c3829]" />
                    <div>
                      <span className="text-stone-800 font-semibold">O'simliklar Shifokori & Parvarish yo'riqnomasi</span>
                      <div className="text-[11px] text-stone-500">Barg sarg'ayishi va kasalliklar tashxisi</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>

                <div
                  onClick={() => {
                    window.open('https://t.me/plantmarket_support', '_blank');
                  }}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Send className="w-4.5 h-4.5 text-sky-600" />
                    <span className="text-stone-800 font-semibold">Telegram qo'llab-quvvatlash xizmati</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>

                <div className="p-3.5 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#1c3829]" />
                    <span>O'simliklar Bozori Milliy Platformasi</span>
                  </div>
                  <span className="font-semibold text-stone-700 font-mono">v2.1.0 Rasmiy</span>
                </div>
              </div>
            </div>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div className="space-y-3 font-serif">
              {orders.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500 glass-card rounded-3xl p-6">
                  Hali buyurtmalar mavjud emas.
                </div>
              ) : (
                orders.map(ord => (
                  <motion.div
                    key={ord.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate({ type: 'order_detail', orderId: ord.id })}
                    className="p-4 glass-card rounded-2xl cursor-pointer transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900 font-display">Buyurtma #{ord.orderNumber}</span>
                      <span className="px-2.5 py-0.5 bg-[#1c3829]/10 text-[#1c3829] border border-[#1c3829]/20 rounded-full font-bold text-[11px]">
                        {ord.currentStatus}
                      </span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none">
                      {ord.items.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.productImage}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-[#e7e0d3]"
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-[#e7e0d3] pt-2">
                      <span className="text-stone-500">{formatDateTime(ord.createdAt)}</span>
                      <span className="font-extrabold text-sm text-[#1c3829] font-mono">{formatUZS(ord.totalAmount)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Favorites Section */}
          {activeSection === 'favorites' && (
            <div>
              {favoriteProducts.length === 0 ? (
                <div className="py-16 text-center text-xs text-stone-500 glass-card rounded-3xl p-6 font-serif">
                  Saralangan o'simliklar ro'yxati bo'sh.
                </div>
              ) : (
                <div className="grid grid-cols-2 min-[560px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                  {favoriteProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Section */}
          {activeSection === 'addresses' && (
            <div className="space-y-3 font-serif">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 font-display">Saqlangan yetkazish manzillari</h3>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddAddressModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1c3829] hover:bg-[#284c37] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-all border border-white/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yangi manzil</span>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    className="p-3.5 glass-card rounded-2xl flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-900">{addr.title}</div>
                      <div className="text-stone-600 mt-0.5">{addr.region}, {addr.cityDistrict}</div>
                      <div className="text-stone-500">{addr.streetAddress} {addr.apartment}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-stone-400 hover:text-[#b85d3f] transition-colors cursor-pointer"
                      title="Manzilni o'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddAddressModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleAddAddress}
              className="bg-[#fcfaf6] rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-3 shadow-2xl border border-[#e7e0d3] text-xs font-serif"
            >
              <h3 className="font-bold text-sm text-stone-900 font-display">Yangi yetkazish manzili</h3>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Nomi (masalan, Uyim, Ish joyim)</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#e7e0d3] rounded-xl focus:outline-hidden focus:border-[#1c3829] text-stone-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Viloyat / Hudud</label>
                <select
                  value={newRegion}
                  onChange={e => setNewRegion(e.target.value as UzbekistanRegion)}
                  className="w-full p-2.5 bg-white border border-[#e7e0d3] rounded-xl focus:outline-hidden focus:border-[#1c3829] text-stone-900 text-xs"
                >
                  {UZBEKISTAN_REGIONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Shahar / Tuman</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  placeholder="Masalan: Mirzo Ulug'bek tumani"
                  className="w-full p-2.5 bg-white border border-[#e7e0d3] rounded-xl focus:outline-hidden focus:border-[#1c3829] text-stone-900 text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Ko'cha va uy raqami</label>
                <input
                  type="text"
                  value={newStreet}
                  onChange={e => setNewStreet(e.target.value)}
                  placeholder="Masalan: Navoiy ko'chasi 14-uy"
                  className="w-full p-2.5 bg-white border border-[#e7e0d3] rounded-xl focus:outline-hidden focus:border-[#1c3829] text-stone-900 text-xs"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#e7e0d3] font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1c3829] hover:bg-[#284c37] text-white font-semibold cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  Saqlash
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
