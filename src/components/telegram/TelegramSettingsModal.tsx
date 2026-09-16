import React, { useState } from 'react';
import {
  Send,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  X,
  CreditCard,
  Package,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { telegramBotService } from '../../services/telegramBotService';
import { TelegramBotSettings } from '../../types';
import { useApp } from '../../context/AppContext';

interface TelegramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramSettingsModal: React.FC<TelegramSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast, addNotification } = useApp();
  const [settings, setSettings] = useState<TelegramBotSettings>(() =>
    telegramBotService.getSettings()
  );
  const [testSent, setTestSent] = useState(false);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = (key: keyof TelegramBotSettings) => {
    const updated = telegramBotService.saveSettings({
      [key]: !settings[key],
    });
    setSettings(updated);
    showToast('Telegram sozlamalari yangilandi!', 'success');
  };

  const handleSaveUsername = (username: string) => {
    const updated = telegramBotService.saveSettings({
      chatId: username,
    });
    setSettings(updated);
  };

  const handleSendTestNotification = () => {
    setTestSent(true);
    const mockOrderNum = 'FW-92841';
    const sampleMsg =
      `🌸 <b>FLOWERWAY | BUYURTMA #${mockOrderNum}</b>\n\n` +
      `👤 <b>Xaridor:</b> ${settings.chatId || '@foydalanuvchi'}\n` +
      `⏱ <b>Holati:</b> ✅ To'lov cheki tasdiqlandi. Buyurtma yig'ilmoqda!\n` +
      `📦 <b>Tarkibi:</b> 1x Monstera Deliciosa, 1x Terrakota Tuvak (M)\n` +
      `💰 <b>Summa:</b> 385 000 so'm\n\n` +
      `🚚 <i>Kuryer yetkazish vaqtida sizga qo'ng'iroq qiladi.</i>`;

    setActivePreview(sampleMsg);

    addNotification({
      title: 'Telegram Xabarnoma Testi',
      message: `Telegram bot (@${settings.botUsername}) orqali ${settings.chatId} ga xabarnoma muvaffaqiyatli yuborildi!`,
      type: 'order',
    });

    showToast('Telegram bot xabari muvaffaqiyatli yuborildi! 📲', 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-serif">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-[#fcfaf6] rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-[#e7e0d3] space-y-5 relative"
        >
          {/* Close button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:text-stone-950 flex items-center justify-center cursor-pointer border border-stone-200 z-10"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Header */}
          <div className="flex items-center gap-3 pr-8">
            <div className="w-11 h-11 rounded-2xl bg-[#0088cc] text-white flex items-center justify-center shadow-xs shrink-0">
              <Send className="w-5 h-5 -rotate-45 -mr-0.5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#1c1917] font-display">
                Telegram Bot Xabarnomalari
              </h2>
              <p className="text-xs text-stone-500 font-serif">
                Buyurtma va to'lov holatini real vaqtda Telegram orqali kuzatib boring
              </p>
            </div>
          </div>

          {/* Bot Connection Status Pill */}
          <div className="p-3.5 rounded-2xl bg-[#eef7fc] border border-[#c3e2f5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0088cc] animate-pulse" />
              <div>
                <div className="text-xs font-bold text-[#0088cc]">
                  @{settings.botUsername} (Faol)
                </div>
                <div className="text-[11px] text-stone-600">
                  Rasmiy avtomatlashtirilgan xabarnoma boti
                </div>
              </div>
            </div>

            <a
              href={`https://t.me/${settings.botUsername}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0088cc] hover:underline"
            >
              <span>Botga o'tish</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Chat ID / Username field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800">
              Sizning Telegram Username yoki ID:
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.chatId}
                onChange={e => handleSaveUsername(e.target.value)}
                placeholder="@username yoki telefon raqam"
                className="w-full h-11 pl-3.5 pr-10 bg-white border border-[#e7e0d3] rounded-xl text-xs font-mono text-stone-900 focus:outline-hidden focus:border-[#0088cc] shadow-2xs"
              />
              <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] text-stone-500">
              Buyurtma berilganda bildirishnomalar aynan shu manzilga yo'llanadi.
            </p>
          </div>

          {/* Notification Options */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider text-[10px]">
              Yuboriladigan Xabarnoma Turlari:
            </span>

            {/* 1. Order Status */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e7e0d3]">
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#1c3829]" />
                <div>
                  <div className="text-xs font-bold text-stone-900">Buyurtma holatlari</div>
                  <div className="text-[10px] text-stone-500">
                    Qabul qilinganda, yig'ilganda va yetkazilganda
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.orderStatusAlerts}
                onChange={() => handleToggle('orderStatusAlerts')}
                className="w-4 h-4 accent-[#0088cc] cursor-pointer"
              />
            </div>

            {/* 2. Payment Receipt */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e7e0d3]">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#b85d3f]" />
                <div>
                  <div className="text-xs font-bold text-stone-900">To'lov kvitansiyasi tasdig'i</div>
                  <div className="text-[10px] text-stone-500">
                    Operator chekni tekshirib tasdiqlaganda
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.paymentReceiptAlerts}
                onChange={() => handleToggle('paymentReceiptAlerts')}
                className="w-4 h-4 accent-[#0088cc] cursor-pointer"
              />
            </div>

            {/* 3. Plant Care Reminders */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e7e0d3]">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#dfb15b]" />
                <div>
                  <div className="text-xs font-bold text-stone-900">Sug'orish eslatmalari</div>
                  <div className="text-[10px] text-stone-500">
                    Sotib olingan o'simliklarni parvarishlash kalendari
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.careReminders}
                onChange={() => handleToggle('careReminders')}
                className="w-4 h-4 accent-[#0088cc] cursor-pointer"
              />
            </div>
          </div>

          {/* Test Dispatch Button */}
          <div className="pt-2 flex flex-col gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleSendTestNotification}
              className="w-full py-3 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 -rotate-45" />
              <span>Test Telegram Xabari Yuborish</span>
            </motion.button>

            {/* Simulated Telegram Message Bubble */}
            {activePreview && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-[#71a6ca]/15 border border-[#71a6ca]/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0088cc]">
                  <span>Telegram Xabar Namunasi:</span>
                  <span className="font-mono">hozir</span>
                </div>
                <div
                  className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs text-[11px] text-stone-800 leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: activePreview.replace(/\n/g, '<br/>') }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
