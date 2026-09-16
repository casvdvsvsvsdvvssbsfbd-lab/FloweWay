import { Order, TelegramBotSettings } from '../types';
import { formatUZS } from '../utils/formatters';

const STORAGE_KEY = 'plant_market_telegram_settings_v1';

export const defaultTelegramSettings: TelegramBotSettings = {
  enabled: true,
  botUsername: 'PlantMarketUz_bot',
  chatId: '@alisher_botanist',
  orderStatusAlerts: true,
  paymentReceiptAlerts: true,
  careReminders: true,
  promoAlerts: false,
};

export class TelegramBotService {
  private settings: TelegramBotSettings;

  constructor() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.settings = stored ? JSON.parse(stored) : defaultTelegramSettings;
    } catch {
      this.settings = defaultTelegramSettings;
    }
  }

  getSettings(): TelegramBotSettings {
    return { ...this.settings };
  }

  saveSettings(updates: Partial<TelegramBotSettings>): TelegramBotSettings {
    this.settings = { ...this.settings, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to persist telegram settings', e);
    }
    return this.getSettings();
  }

  formatOrderNotification(order: Order, statusUpdateText?: string): {
    header: string;
    text: string;
    telegramPreviewHtml: string;
    timestamp: string;
  } {
    const time = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const itemsList = order.items
      .map(it => `  • <b>${it.product.name}</b> (${it.quantity} dona) — ${formatUZS(it.price * it.quantity)}`)
      .join('\n');

    const paymentText =
      order.paymentMethod === 'direct_card'
        ? `💳 Karta orqali to'lov (Kvitansiya: ${order.paymentReceiptName || 'Yuklangan'})`
        : order.paymentMethod === 'cash_on_delivery'
        ? "💵 Qabul qilinganda naqd to'lov"
        : `💳 Onlayn to'lov (${order.paymentMethod.toUpperCase()})`;

    const text = `🌿 <b>PLANT MARKET | BUYURTMA #${order.orderNumber}</b>\n\n` +
      `👤 <b>Xaridor:</b> ${order.customerName}\n` +
      `📞 <b>Telefon:</b> ${order.phoneNumber}\n` +
      `📍 <b>Yetkazish manzili:</b> ${order.deliveryAddress.street}, ${order.deliveryAddress.city}\n` +
      `⏱ <b>Holati:</b> ${statusUpdateText || "Qabul qilindi va yig'ilmoqda"}\n\n` +
      `📦 <b>Tarkibi:</b>\n${itemsList}\n\n` +
      `💰 <b>Umumiy summa:</b> ${formatUZS(order.totalAmount)}\n` +
      `🧾 <b>To'lov turi:</b> ${paymentText}\n\n` +
      `🚚 <i>Kuryer termo-qutida yetkazib beradi. Holatni kuzatib boring!</i>`;

    return {
      header: `Telegram Xabarnoma: Buyurtma #${order.orderNumber}`,
      text,
      telegramPreviewHtml: text.replace(/\n/g, '<br/>'),
      timestamp: time,
    };
  }

  formatPaymentReceiptAlert(orderNumber: string, amount: number, cardHolder: string): string {
    return `💳 <b>TO'LOV KVITANSIYASI QABUL QILINDI!</b>\n\n` +
      `Buyurtma: <b>#${orderNumber}</b>\n` +
      `Summa: <b>${formatUZS(amount)}</b>\n` +
      `Hisob: <b>${cardHolder}</b>\n\n` +
      `✅ Operator to'lovingizni 5 daqiqa ichida tasdiqlaydi.`;
  }
}

export const telegramBotService = new TelegramBotService();
