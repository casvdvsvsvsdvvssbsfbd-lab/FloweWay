import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Truck,
  CreditCard,
  Building2,
  FileCheck,
  Eye,
  X,
  Repeat,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { marketplaceService } from '../../services/marketplaceService';
import { Order, OrderStatus } from '../../types';
import { formatDateTime, formatUZS } from '../../utils/formatters';

interface OrderDetailViewProps {
  orderId: string;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId }) => {
  const { navigate, goBack, addToCart, showToast, allProducts } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    marketplaceService.getOrderById(orderId).then(res => {
      if (res) setOrder(res);
    });
  }, [orderId]);

  if (!order) {
    return (
      <div className="py-24 text-center text-stone-400 text-sm font-serif">
        Buyurtma ma'lumotlari yuklanmoqda...
      </div>
    );
  }

  const statusMap: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    'Order received': { label: 'Qabul qilindi', color: 'text-blue-700', bg: 'bg-blue-50/80 border-blue-200' },
    'Confirmed': { label: 'Tasdiqlandi', color: 'text-indigo-700', bg: 'bg-indigo-50/80 border-indigo-200' },
    'Preparing': { label: 'Qadoqlanmoqda', color: 'text-amber-700', bg: 'bg-amber-50/80 border-amber-200' },
    'Assigned to courier': { label: 'Kuryerga berildi', color: 'text-purple-700', bg: 'bg-purple-50/80 border-purple-200' },
    'On the way': { label: 'Kuryer yo\'lda', color: 'text-purple-700', bg: 'bg-purple-50/80 border-purple-200' },
    'Delivered': { label: 'Yetkazib berildi', color: 'text-[#1c3829]', bg: 'bg-emerald-50/80 border-emerald-200' },
    'Cancelled': { label: 'Bekor qilindi', color: 'text-rose-700', bg: 'bg-rose-50/80 border-rose-200' },
  };

  const currentStatusInfo = statusMap[order.currentStatus] || {
    label: order.currentStatus,
    color: 'text-[#1c3829]',
    bg: 'bg-emerald-50/80 border-emerald-200',
  };

  // Re-order functionality
  const handleRepeatOrder = () => {
    order.items.forEach(i => {
      const prod = allProducts.find(p => p.id === i.productId);
      if (prod) {
        addToCart(prod, i.quantity);
      }
    });
    showToast("Mahsulotlar savatga qo'shildi! 🛒", 'success');
    navigate({ type: 'tab', tab: 'cart' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-24 space-y-4 max-w-4xl mx-auto font-serif"
    >
      {/* Top action bar */}
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
        <span className="text-xs font-bold text-stone-900 font-display">
          Buyurtma: #{order.orderNumber}
        </span>
      </div>

      {/* Status Card */}
      <div>
        <div className={`p-5 sm:p-6 rounded-3xl border ${currentStatusInfo.bg} space-y-2 shadow-xs backdrop-blur-xs`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wide ${currentStatusInfo.color}`}>
              {currentStatusInfo.label}
            </span>
            <span className="text-xs text-stone-500 font-mono">{formatDateTime(order.createdAt)}</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-stone-900 font-display">
            {order.currentStatus === 'Delivered'
              ? 'Buyurtmangiz muvaffaqiyatli yetkazildi! 🌱'
              : `Kutilayotgan yetkazish vaqti: ${order.estimatedDeliveryTime}`}
          </h2>
        </div>
      </div>

      {/* Interactive Delivery Timeline */}
      <div>
        <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2 font-display">
            <Truck className="w-4 h-4 text-[#1c3829]" />
            <span>Yetkazib berish bosqichlari</span>
          </h3>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e7e0d3]">
            {order.statusHistory.map((step, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    step.completed
                      ? 'bg-[#1c3829] border-[#1c3829] text-white'
                      : 'bg-white border-stone-300'
                  }`}
                >
                  {step.completed && <CheckCircle2 className="w-3 h-3" />}
                </div>

                <div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span
                      className={`font-bold ${
                        step.completed ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {step.status}
                    </span>
                    {step.timestamp && <span className="text-[11px] text-stone-400 font-mono">{step.timestamp}</span>}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ordered Products List */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs sm:text-sm text-stone-900 font-display">
          Buyurtma qilingan mahsulotlar ({order.items.length})
        </h3>

        <div className="space-y-2 glass-card rounded-3xl p-4 sm:p-5">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate({ type: 'product_detail', productId: item.productId })}
              className="flex items-center justify-between gap-3 p-2 hover:bg-stone-50/60 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.productImage}
                  alt=""
                  className="w-12 h-12 object-cover rounded-xl bg-stone-100 shrink-0 border border-[#e7e0d3]"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-800 truncate">{item.productName}</h4>
                  <div className="text-[11px] text-stone-400 font-mono">
                    <span>
                      {item.quantity} x {formatUZS(item.unitPrice)}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-extrabold text-[#1c3829] shrink-0 font-mono">
                {formatUZS(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery & Payment Details */}
      <div className="space-y-3">
        {/* Address */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-stone-900 font-display">
            <MapPin className="w-4 h-4 text-[#1c3829]" />
            <span>Yetkazish manzili</span>
          </div>
          <div className="text-stone-700 pl-5">
            <div>
              {order.deliveryAddress.region}, {order.deliveryAddress.cityDistrict}
            </div>
            <div>
              {order.deliveryAddress.streetAddress} {order.deliveryAddress.apartment}
            </div>
            <div className="text-stone-500 mt-1">
              Mijoz: {order.customerName} ({order.phoneNumber})
            </div>
            {order.courierNotes && (
              <div className="text-stone-500 italic mt-0.5">
                Kuryer uchun: "{order.courierNotes}"
              </div>
            )}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 space-y-2 text-xs">
          <h4 className="font-bold text-stone-900 text-xs sm:text-sm mb-1 font-display">To'lov ma'lumotlari</h4>
          <div className="flex justify-between text-stone-600 font-mono">
            <span className="font-serif">Mahsulotlar:</span>
            <span>{formatUZS(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600 font-mono">
            <span className="font-serif">Yetkazib berish ({order.deliveryMethod}):</span>
            <span>{order.deliveryFee === 0 ? 'Bepul' : formatUZS(order.deliveryFee)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-[#b85d3f] font-semibold font-mono">
              <span className="font-serif">Chegirma:</span>
              <span>-{formatUZS(order.discountAmount)}</span>
            </div>
          )}
          {order.usedBonusPoints && order.usedBonusPoints > 0 && (
            <div className="flex justify-between text-amber-700 font-semibold font-mono">
              <span className="font-serif">Bonuslar:</span>
              <span>-{formatUZS(order.usedBonusPoints)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-[#e7e0d3] flex justify-between font-bold text-sm text-stone-900">
            <span>Jami:</span>
            <span className="text-base text-[#1c3829] font-mono font-black">{formatUZS(order.totalAmount)}</span>
          </div>
          <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>To'lov usuli: {order.paymentMethod.toUpperCase()}</span>
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-100 text-[#1c3829]'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {order.paymentStatus === 'paid' ? "To'langan" : "Qabul qilinganda to'lanadi"}
            </span>
          </div>
        </div>
      </div>

      {/* Repeat Order Action */}
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRepeatOrder}
          className="w-full py-3 bg-[#1c3829] hover:bg-[#284c37] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-white/20"
        >
          <Repeat className="w-4 h-4" />
          <span>Buyurtmani qayta rasmiylashtirish</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
