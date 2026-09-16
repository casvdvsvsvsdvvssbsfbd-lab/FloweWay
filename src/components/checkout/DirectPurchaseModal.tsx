import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Copy,
  Check,
  UploadCloud,
  FileText,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { useApp, OFFICIAL_BUSINESS_CARD } from '../../context/AppContext';
import { formatUZS } from '../../utils/formatters';
import { UZBEKISTAN_REGIONS } from '../../data/mockData';
import { marketplaceService } from '../../services/marketplaceService';
import { IOSSmoothImage } from '../common/IOSSmoothImage';
import { RealisticCreditCard } from './RealisticCreditCard';
import { PaymentCountdownBanner } from './PaymentCountdownBanner';

interface DirectPurchaseModalProps {
  product: Product;
  selectedSize?: ProductSize;
  initialQuantity?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectPurchaseModal: React.FC<DirectPurchaseModalProps> = ({
  product,
  selectedSize,
  initialQuantity = 1,
  isOpen,
  onClose,
}) => {
  const {
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    selectedAddress,
    selectedDeliveryMethod,
    placeCurrentOrder,
    navigate,
    showToast,
  } = useApp();

  // 1: User Card Input -> 2: Business Card Details -> 3: Upload Check Receipt -> 4: Success
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: User Card State
  const [userCardNumber, setUserCardNumber] = useState('');
  const [userRegion, setUserRegion] = useState(selectedAddress?.region || 'Toshkent shahri');
  const [userDistrict, setUserDistrict] = useState(selectedAddress?.cityDistrict || 'Mirzo Ulug‘bek tumani');
  const [userStreet, setUserStreet] = useState(selectedAddress?.streetAddress || 'Buyuk Ipak Yo‘li ko‘chasi, 42-uy');
  const [cardHolderInput, setCardHolderInput] = useState(customerName || 'AZIZ KARIMOV');

  // Step 2 & 3: Payment & Receipt State
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const unitPrice = product.price;
  const quantity = Math.max(1, initialQuantity);
  const subtotal = unitPrice * quantity;
  const deliveryCalc = marketplaceService.calculateDeliveryFee(userRegion, selectedDeliveryMethod, subtotal);
  const deliveryFee = deliveryCalc.fee;
  const totalAmount = subtotal + deliveryFee;

  // Format 16-digit card input
  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '').slice(0, 16);
    // Format into groups of 4: "8600 1234 5678 9012"
    const formatted = rawDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setUserCardNumber(formatted);
  };

  const rawDigitsOnly = userCardNumber.replace(/\s/g, '');
  const isCardValid = rawDigitsOnly.length === 16;

  // Detect card brand
  const getCardBrand = (digits: string) => {
    if (digits.startsWith('8600')) return { name: 'UZCARD', color: 'bg-blue-900', badge: 'UZCARD' };
    if (digits.startsWith('9860')) return { name: 'HUMO', color: 'bg-emerald-900', badge: 'HUMO' };
    if (digits.startsWith('4')) return { name: 'VISA', color: 'bg-indigo-950', badge: 'VISA' };
    if (digits.startsWith('5')) return { name: 'Mastercard', color: 'bg-red-950', badge: 'Mastercard' };
    return { name: 'Plastik karta', color: 'bg-stone-900', badge: 'KARTA' };
  };
  const cardBrand = getCardBrand(rawDigitsOnly);

  // Copy business card number
  const handleCopyBusinessCard = () => {
    navigator.clipboard?.writeText(OFFICIAL_BUSINESS_CARD.cardNumberRaw || '8600530492104402');
    setCopiedCard(true);
    showToast('Biznes karta raqami nusxalandi! 📋', 'success');
    setTimeout(() => setCopiedCard(false), 2500);
  };

  // Copy amount
  const handleCopyAmount = () => {
    navigator.clipboard?.writeText(totalAmount.toString());
    setCopiedAmount(true);
    showToast('To‘lov summasi nusxalandi! 💰', 'success');
    setTimeout(() => setCopiedAmount(false), 2500);
  };

  // Handle Receipt Upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setReceiptFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
      showToast('To‘lov cheki yuklandi! ✅', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Attach sample mock receipt for rapid testing in preview
  const handleAttachSampleReceipt = () => {
    const sampleReceiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="%23ffffff"><rect width="600" height="800" fill="%23f8fafc" rx="24"/><rect x="40" y="40" width="520" height="720" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2" rx="16"/><circle cx="300" cy="110" r="36" fill="%2310b981"/><path d="M288 110l8 8 16-16" stroke="%23ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="180" font-family="sans-serif" font-size="22" font-weight="bold" fill="%230f172a" text-anchor="middle">TO'LOV MUVAFFAQIYATLI</text><text x="300" y="210" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">GREEN BOTANICA MCHJ</text><line x1="70" y1="240" x2="530" y2="240" stroke="%23e2e8f0" stroke-dasharray="6,6"/><text x="80" y="290" font-family="sans-serif" font-size="14" fill="%2364748b">Summa:</text><text x="520" y="290" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23047857" text-anchor="end">${totalAmount.toLocaleString()} UZS</text><text x="80" y="340" font-family="sans-serif" font-size="14" fill="%2364748b">Qabul qiluvchi karta:</text><text x="520" y="340" font-family="monospace" font-size="14" font-weight="bold" fill="%230f172a" text-anchor="end">8600 5304 9210 4402</text><text x="80" y="390" font-family="sans-serif" font-size="14" fill="%2364748b">Yuboruvchi karta:</text><text x="520" y="390" font-family="monospace" font-size="14" font-weight="bold" fill="%230f172a" text-anchor="end">${userCardNumber || '8600 •••• •••• ••••'}</text><text x="80" y="440" font-family="sans-serif" font-size="14" fill="%2364748b">Sana va vaqt:</text><text x="520" y="440" font-family="sans-serif" font-size="14" fill="%230f172a" text-anchor="end">${new Date().toLocaleString('uz-UZ')}</text><text x="80" y="490" font-family="sans-serif" font-size="14" fill="%2364748b">Tranzaksiya ID:</text><text x="520" y="490" font-family="monospace" font-size="13" fill="%2364748b" text-anchor="end">TXN-${Math.floor(10000000 + Math.random() * 90000000)}</text><rect x="80" y="550" width="440" height="100" fill="%23ecfdf5" rx="12" stroke="%23a7f3d0"/><text x="300" y="595" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23065f46" text-anchor="middle">Plastik karta orqali to'lov tasdiqlangan</text><text x="300" y="620" font-family="sans-serif" font-size="11" fill="%23047857" text-anchor="middle">Kvitansiya tekshiruvdan o'tkazildi</text></svg>`;
    setReceiptPreview(sampleReceiptSvg);
    setReceiptFileName(`tolov_cheki_${Date.now()}.png`);
    showToast('Namuna to‘lov kvitansiyasi biriktirildi! 📄', 'success');
  };

  // Submit Order with receipt
  const handleSubmitPurchase = async () => {
    if (!receiptPreview) {
      showToast('Iltimos, to‘lov chekini yuklang!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const order = await placeCurrentOrder({
        userCardNumber,
        paymentReceiptUrl: receiptPreview,
        paymentReceiptName: receiptFileName || 'tolov-cheki.png',
        directItems: [
          {
            productId: product.id,
            productName: `${product.name}${selectedSize ? ` (${selectedSize.name})` : ''}`,
            productImage: product.images[0],
            unitPrice: product.price,
            quantity,
            totalPrice: product.price * quantity,
          },
        ],
        customTotal: totalAmount,
        customSubtotal: subtotal,
      });

      if (order) {
        setCompletedOrderId(order.id);
        setCompletedOrderNumber(order.orderNumber);
        setActiveStep(4);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-[28px] sm:rounded-[40px] border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Product Pill */}
        <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/70">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-stone-200 shrink-0 bg-white">
              <IOSSmoothImage
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Tezkor Sotib Olish
              </span>
              <h3 className="text-xs sm:text-base font-bold text-stone-900 truncate">
                {product.name}
              </h3>
              <div className="text-[11px] sm:text-xs font-bold text-stone-600">
                {quantity} dona • <span className="text-emerald-700">{formatUZS(totalAmount)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        {activeStep < 4 && (
          <div className="px-4 sm:px-6 pt-4 pb-2">
            <div className="flex items-center justify-between text-[10.5px] min-[400px]:text-xs font-bold text-stone-700 mb-2">
              <span className={activeStep === 1 ? 'text-emerald-800' : 'text-stone-400'}>
                1. Karta raqam
              </span>
              <span className={activeStep === 2 ? 'text-emerald-800' : 'text-stone-400'}>
                2. Biznes karta
              </span>
              <span className={activeStep === 3 ? 'text-emerald-800' : 'text-stone-400'}>
                3. To'lov cheki
              </span>
            </div>
            <div className="flex gap-1.5 h-1.5 rounded-full overflow-hidden bg-stone-100">
              <div
                className={`flex-1 transition-all ${
                  activeStep >= 1 ? 'bg-emerald-600' : 'bg-stone-200'
                }`}
              />
              <div
                className={`flex-1 transition-all ${
                  activeStep >= 2 ? 'bg-emerald-600' : 'bg-stone-200'
                }`}
              />
              <div
                className={`flex-1 transition-all ${
                  activeStep >= 3 ? 'bg-emerald-600' : 'bg-stone-200'
                }`}
              />
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* STEP 1: User 16-digit card input */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full text-emerald-800 text-xs font-bold border border-emerald-100 mb-1">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>16 talik karta raqami</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-stone-900">
                  O‘zingizning 16 talik plastik karta raqamingizni kiriting
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  To‘lovni qaysi kartangizdan amalga oshirishingizni bilishimiz uchun karta raqamingizni kiriting.
                </p>
              </div>

              {/* Realistic Visual Card Preview (Real aspect ratio 1.586:1) */}
              <RealisticCreditCard
                variant="user"
                cardNumber={userCardNumber || '8600 •••• •••• ••••'}
                cardHolder={cardHolderInput || 'XARIDOR'}
                bankName={cardBrand.name}
                cardBrandName={cardBrand.badge}
                subTitle="Mijoz To'lov Kartasi"
              />

              {/* Card Number Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 flex justify-between">
                  <span>Plastik karta raqami (16 ta raqam)</span>
                  <span className={`text-[11px] ${isCardValid ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
                    {rawDigitsOnly.length} / 16 ta
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="8600 0000 0000 0000"
                    value={userCardNumber}
                    onChange={handleCardInputChange}
                    className={`w-full py-3.5 pl-4 pr-12 text-base font-mono font-bold tracking-wider rounded-2xl border transition-all ${
                      isCardValid
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                        : 'border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCardValid ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <CreditCard className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Details row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700">Ism va familiyangiz</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => {
                      setCustomerName(e.target.value);
                      setCardHolderInput(e.target.value);
                    }}
                    placeholder="Masalan: Jamshid Aliyev"
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700">Telefon raqamingiz</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+998 90 123-45-67"
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                disabled={!isCardValid}
                onClick={() => setActiveStep(2)}
                className="w-full py-4 px-6 rounded-full bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Biznes kartamiz rekvizitlarini olish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Official Business Card & Payment Instructions */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              {/* TOP NOTICE: 7-minute countdown banner with auto-close warning */}
              <PaymentCountdownBanner
                initialSeconds={420}
                onExpire={() => {
                  showToast("7 daqiqalik to'lov vaqti tugadi. Xavfsizlik maqsadida xarid bekor qilindi.", 'error');
                  onClose();
                }}
                onExtend={() => {
                  showToast("To'lov vaqti yana 7 daqiqaga uzaytirildi! ⏱", 'info');
                }}
              />

              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-amber-900 text-xs font-bold border border-amber-200 mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Biznes Karta Rekvizitlari</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-stone-900 font-sans">
                  Bizning biznes kartamizga to‘lov qiling
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans">
                  Quyidagi rasmiy biznes kartamizga to‘lovni o‘tkazing va chekni saqlab oling.
                </p>
              </div>

              {/* High-Fidelity Realistic Business Card (Aspect Ratio 1.586:1) */}
              <RealisticCreditCard
                variant="business"
                cardNumber={OFFICIAL_BUSINESS_CARD.cardNumber}
                cardHolder={OFFICIAL_BUSINESS_CARD.cardHolder}
                bankName={OFFICIAL_BUSINESS_CARD.bankName}
                inn={OFFICIAL_BUSINESS_CARD.inn}
                cardBrandName="UZCARD BUSINESS"
                subTitle="Rasmiy Korporativ Hisob"
                onCopy={handleCopyBusinessCard}
                isCopied={copiedCard}
              />

              {/* Exact Amount Banner with 1-click Copy */}
              <div className="p-4 bg-[#faf7f2] rounded-2xl border border-[#e6ded2] flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#1c3829] tracking-wider font-sans">
                    To‘lanishi kerak bo‘lgan aniq summa
                  </span>
                  <div className="text-lg sm:text-2xl font-extrabold text-[#1c3829] font-price">
                    {formatUZS(totalAmount)}
                  </div>
                </div>
                <button
                  onClick={handleCopyAmount}
                  className="px-3.5 py-2 rounded-xl bg-[#1c3829] hover:bg-[#284c37] text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0 shadow-xs font-sans"
                >
                  {copiedAmount ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-300" />
                      <span>Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#dfb15b]" />
                      <span>Summani nusxalash</span>
                    </>
                  )}
                </button>
              </div>

              {/* Payment apps guide */}
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5 shadow-2xs font-sans">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1c3829]" />
                  <span>Qanday to‘lanadi?</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Payme, Click, Uzum Bank yoki istalgan bank ilovangizni oching, biznes karta raqamini kiriting va{' '}
                  <b className="text-stone-900 font-price">{formatUZS(totalAmount)}</b> o‘tkazing. To‘lovdan keyin chekni screenshot qilib saqlang.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setActiveStep(1)}
                  className="w-1/3 py-3.5 px-4 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer font-sans"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Orqaga</span>
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="w-2/3 py-3.5 px-5 rounded-full bg-[#1c3829] hover:bg-[#284c37] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer font-sans"
                >
                  <span>To‘lov qildim, chekni yuklash</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Payment Receipt */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              {/* TOP NOTICE: 7-minute countdown banner continues */}
              <PaymentCountdownBanner
                initialSeconds={420}
                onExpire={() => {
                  showToast("7 daqiqalik to'lov vaqti tugadi. Xavfsizlik maqsadida xarid bekor qilindi.", 'error');
                  onClose();
                }}
                onExtend={() => {
                  showToast("To'lov vaqti yana 7 daqiqaga uzaytirildi! ⏱", 'info');
                }}
              />

              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-amber-900 text-xs font-bold border border-amber-200 mb-1">
                  <UploadCloud className="w-3.5 h-3.5 text-[#b85d3f]" />
                  <span>To‘lov Kvitansiyasi (Chek)</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-stone-900 font-sans">
                  To‘lov qilgan chekingizni yuklang
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans">
                  Bank ilovangizdan saqlab olingan to‘lov chekining rasmini yoki skrinshotini quyida yuboring.
                </p>
              </div>

              {/* Upload Drop Zone / Preview */}
              {!receiptPreview ? (
                <div className="relative border-2 border-dashed border-[#d8cfbe] hover:border-[#1c3829] rounded-[24px] p-6 text-center bg-[#faf8f5] hover:bg-[#f5efe6] transition-all group">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleReceiptUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#e6ded2] text-[#1c3829] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div className="font-bold text-stone-800 text-xs sm:text-sm font-sans">
                      To‘lov chekini tanlang yoki bu yerga tashlang
                    </div>
                    <div className="text-[11px] text-stone-400 font-sans">
                      PNG, JPG yoki PDF (maksimal 10MB)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-[#faf7f2] border border-[#e6ded2] rounded-[24px] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#1c3829]" />
                      <span className="text-xs font-bold text-stone-900 truncate max-w-[200px] font-sans">
                        {receiptFileName || 'tolov_cheki.png'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setReceiptPreview(null);
                        setReceiptFile(null);
                        setReceiptFileName('');
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Chekni o'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="h-44 w-full bg-white rounded-xl border border-stone-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={receiptPreview}
                      alt="To'lov cheki"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold justify-center font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>To‘lov cheki muvaffaqiyatli biriktirildi</span>
                  </div>
                </div>
              )}

              {/* Sample receipt test button for fast evaluation */}
              {!receiptPreview && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAttachSampleReceipt}
                    className="text-xs font-semibold text-[#1c3829] hover:text-[#b85d3f] underline underline-offset-2 flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <span>⚡ Namuna chek bilan sinab ko‘rish</span>
                  </button>
                </div>
              )}

              {/* Optional reference / note */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-700 font-sans">
                  Tranzaksiya raqami yoki izoh (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  placeholder="Masalan: TXN-948123 yoki Payme ID"
                  className="w-full p-3 text-xs rounded-xl border border-stone-300 focus:border-[#1c3829] focus:ring-1 focus:ring-[#1c3829] font-sans"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveStep(2)}
                  className="w-1/3 py-3.5 px-4 rounded-full border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer font-sans"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Orqaga</span>
                </button>
                <button
                  disabled={!receiptPreview || submitting}
                  onClick={handleSubmitPurchase}
                  className="w-2/3 py-3.5 px-5 rounded-full bg-[#1c3829] hover:bg-[#284c37] disabled:opacity-40 disabled:hover:bg-[#1c3829] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer font-sans"
                >
                  {submitting ? (
                    <span>Rasmiylashtirilmoqda...</span>
                  ) : (
                    <>
                      <span>Chekni yuborish va Tasdiqlash</span>
                      <Sparkles className="w-4 h-4 text-[#dfb15b]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Tracking */}
          {activeStep === 4 && (
            <div className="text-center space-y-5 animate-in fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  To‘lov Cheki Qabul Qilindi
                </span>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  Buyurtmangiz muvaffaqiyatli qabul qilindi! 🎉
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  To‘lov kvitansiyangiz tekshiruvga yuborildi. Kuryer buyurtmangizni tayyorlab tez orada yetkazadi.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-[28px] border border-stone-200 text-left space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Buyurtma raqami:</span>
                  <span className="font-mono font-bold text-stone-900">#{completedOrderNumber}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Sotib olingan gul:</span>
                  <span className="font-bold text-stone-900 truncate max-w-[200px]">{product.name}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>To‘langan summa:</span>
                  <span className="font-bold text-emerald-800">{formatUZS(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Sizning kartangiz:</span>
                  <span className="font-mono text-stone-800">{userCardNumber}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Biznes karta:</span>
                  <span className="font-mono text-stone-800">{OFFICIAL_BUSINESS_CARD.cardNumber}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    if (completedOrderId) {
                      navigate({ type: 'order_detail', orderId: completedOrderId });
                    }
                  }}
                  className="flex-1 py-3.5 px-5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <span>Buyurtmani kuzatish</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="py-3.5 px-5 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Xaridni davom ettirish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
