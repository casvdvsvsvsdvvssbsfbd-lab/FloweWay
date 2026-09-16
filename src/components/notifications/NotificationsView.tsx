import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  ArrowLeft,
  Truck,
  Sparkles,
  Droplets,
  Coins,
  PackageCheck,
  ChevronRight,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    goBack,
    navigate,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'delivery' | 'promotion' | 'plant_care'>('all');

  const filteredNotifications = notifications.filter(item => {
    if (activeFilter === 'unread') return !item.read;
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  // Sound chime for incoming notification
  const playNotificationChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context might require initial user tap
    }
  };

  const handleSendTestNotification = () => {
    const samples = [
      {
        title: '🌱 Monstera parvarishi eslatmasi',
        message: "Monstera Deliciosa tuprog'i qurigan bo'lishi mumkin. Bugun 250ml xona haroratidagi suv quyish tavsiya etiladi.",
        type: 'plant_care' as const,
      },
      {
        title: '🎉 Maxsus chegirma: Promokod "BAHOR15"',
        message: "Faqat bugun barcha xona o'simliklariga 15% chegirma amal qilmoqda. Shoshiling!",
        type: 'promotion' as const,
      },
      {
        title: '🚚 Buyurtmangiz yetkazilmoqda',
        message: "Kuryer Shaxzod siz tomonga yo'l oldi. Taxminiy vaqt: 30 daqiqa ichida.",
        type: 'delivery' as const,
        targetOrderId: 'ord-pm-9021',
      },
      {
        title: "🎁 +15 000 so'm bonus qo'shildi",
        message: "Do'stingiz taklif havolangiz orqali buyurtma berdi va sizga sovg'a bonusi hisoblandi!",
        type: 'bonus' as const,
      },
    ];

    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    playNotificationChime();
    addNotification(randomSample);
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'promotion':
        return <Sparkles className="w-4 h-4 text-[#b85d3f]" />;
      case 'plant_care':
        return <Droplets className="w-4 h-4 text-[#1c3829]" />;
      case 'bonus':
        return <Coins className="w-4 h-4 text-amber-600" />;
      default:
        return <PackageCheck className="w-4 h-4 text-[#1c3829]" />;
    }
  };

  const getBgColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'delivery':
        return 'bg-blue-50 border-blue-200';
      case 'promotion':
        return 'bg-[#b85d3f]/10 border-[#b85d3f]/20';
      case 'plant_care':
        return 'bg-[#1c3829]/10 border-[#1c3829]/20';
      case 'bonus':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-stone-50 border-stone-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-24 pt-2 max-w-4xl mx-auto space-y-6 font-serif"
    >
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e0d3] pb-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-900 cursor-pointer"
            aria-label="Orqaga"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2 font-display">
              <span>Bildirishnomalar</span>
              {unreadNotifCount > 0 && (
                <span className="bg-[#b85d3f] text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs font-mono">
                  {unreadNotifCount} ta yangi
                </span>
              )}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Buyurtma holati, parvarish eslatmalari va yangi chegirmalar
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <motion.button
            id="test-notification-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendTestNotification}
            className="inline-flex items-center gap-1.5 glass-card hover:bg-white text-stone-900 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Yangi xabar kelishini sinab ko'rish"
          >
            <Send className="w-3.5 h-3.5 text-[#1c3829]" />
            <span>Xabar kelishini sinab ko'rish</span>
          </motion.button>

          {unreadNotifCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => markAllNotificationsAsRead()}
              className="inline-flex items-center gap-1 text-[#1c3829] hover:underline font-semibold text-xs px-3 py-2 rounded-xl cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>O'qilgan deb belgilash</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'all', label: `Barchasi (${notifications.length})` },
          { id: 'unread', label: `O'qilmagan (${unreadNotifCount})` },
          { id: 'delivery', label: '🚚 Yetkazish' },
          { id: 'promotion', label: '🏷️ Aksiyalar' },
          { id: 'plant_care', label: '🌱 Parvarish' },
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
            className={`px-4 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-[#1c3829] text-white shadow-xs border border-white/20'
                : 'glass-pill text-stone-700 hover:text-stone-950'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center max-w-sm mx-auto space-y-3 glass-card rounded-3xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-[#e7e0d3] flex items-center justify-center text-stone-400">
            <Bell className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-bold text-stone-900 font-display">
            Hozircha xabarnomalar yo'q
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Yangi buyurtmalar, chegirmalar va o'simlik parvarishi bo'yicha eslatmalar shu yerda paydo bo'ladi.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendTestNotification}
            className="inline-flex items-center gap-1.5 bg-[#1c3829] hover:bg-[#284c37] text-white font-semibold text-xs px-4 py-2 rounded-xl mt-1 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Xabar kelishini sinab ko'rish</span>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {filteredNotifications.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex gap-3 items-start ${
                  !item.read
                    ? 'glass-card border-[#1c3829]/40 shadow-xs ring-1 ring-[#1c3829]/15'
                    : 'glass-card hover:border-stone-400'
                }`}
              >
                {/* Type Icon */}
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getBgColor(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        !item.read ? 'text-stone-900 font-display' : 'text-stone-600'
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-medium shrink-0 font-mono">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {/* Contextual Action Button */}
                  <div className="mt-2.5 flex items-center gap-2">
                    {item.targetOrderId && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={e => {
                          e.stopPropagation();
                          markNotificationAsRead(item.id);
                          navigate({ type: 'order_detail', orderId: item.targetOrderId! });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-[#e7e0d3] px-3 py-1 rounded-xl transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Buyurtmani ko'rish</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                      </motion.button>
                    )}

                    {item.type === 'plant_care' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={e => {
                          e.stopPropagation();
                          markNotificationAsRead(item.id);
                          navigate({ type: 'plant_care_guide' });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-[#e7e0d3] px-3 py-1 rounded-xl transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Parvarish qo'llanmasi</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                      </motion.button>
                    )}

                    {item.type === 'promotion' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={e => {
                          e.stopPropagation();
                          markNotificationAsRead(item.id);
                          navigate({ type: 'tab', tab: 'catalog' });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#1c3829] hover:bg-[#284c37] px-3 py-1 rounded-xl transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Aksiyani ko'rish</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    )}

                    {!item.read && (
                      <span className="text-[10px] text-[#1c3829] font-bold ml-auto flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1c3829] animate-pulse" />
                        <span>Yangi xabar</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
