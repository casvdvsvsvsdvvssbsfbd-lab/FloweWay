import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
  User,
  Smartphone,
  Banknote,
  ShoppingBag,
  Sparkles,
  Wifi,
  Check,
  Lock,
  Copy,
  UploadCloud,
  FileText,
  Trash2,
  Building2,
} from 'lucide-react';
import { useApp, OFFICIAL_BUSINESS_CARD } from '../../context/AppContext';
import { UZBEKISTAN_REGIONS, mockDeliveryMethods, mockPaymentMethods } from '../../data/mockData';
import { DeliveryMethodType, PaymentMethodType, UzbekistanRegion } from '../../types';
import { formatUZS } from '../../utils/formatters';
import { marketplaceService } from '../../services/marketplaceService';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotalCount,
    appliedPromo,
    promoDiscount,
    usedBonusPoints,
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    deliveryInstructions,
    setDeliveryInstructions,
    selectedAddress,
    setSelectedAddress,
    selectedDeliveryMethod,
    setSelectedDeliveryMethod,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    placeCurrentOrder,
    navigate,
    goBack,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [submitting, setSubmitting] = useState(false);

  // Address form fields
  const [selectedRegion, setSelectedRegion] = useState<UzbekistanRegion>(
    selectedAddress?.region || 'Toshkent shahri'
  );
  const [cityDistrict, setCityDistrict] = useState(selectedAddress?.cityDistrict || 'Chilonzor tumani');
  const [streetAddress, setStreetAddress] = useState(
    selectedAddress?.streetAddress || 'Chilonzor 9-mavze, 14-uy'
  );
  const [apartment, setApartment] = useState(selectedAddress?.apartment || 'kv. 28');

  // Step 4 & 5: Card & Receipt States
  const [userCardNumber, setUserCardNumber] = useState('8600 4521 9087 1142');
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState('');

  // Dynamic delivery fee calculation
  const deliveryCalc = marketplaceService.calculateDeliveryFee(
    selectedRegion,
    selectedDeliveryMethod,
    cartSubtotal
  );
  const deliveryFee = deliveryCalc.fee;
  const totalAmount = Math.max(0, cartSubtotal + deliveryFee - promoDiscount - usedBonusPoints);

  const rawDigitsOnly = userCardNumber.replace(/\s/g, '');
  const isCardValid = rawDigitsOnly.length === 16;

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setUserCardNumber(formatted);
  };

  const handleCopyBusinessCard = () => {
    navigator.clipboard?.writeText(OFFICIAL_BUSINESS_CARD.cardNumberRaw || '8600530492104402');
    setCopiedCard(true);
    showToast('Biznes karta raqami nusxalandi! 📋', 'success');
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const handleCopyAmount = () => {
    navigator.clipboard?.writeText(totalAmount.toString());
    setCopiedAmount(true);
    showToast('To‘lov summasi nusxalandi! 💰', 'success');
    setTimeout(() => setCopiedAmount(false), 2500);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
      showToast('To‘lov cheki yuklandi! ✅', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAttachSampleReceipt = () => {
    const sampleReceiptSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="%23ffffff"><rect width="600" height="800" fill="%23f8fafc" rx="24"/><rect x="40" y="40" width="520" height="720" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2" rx="16"/><circle cx="300" cy="110" r="36" fill="%2310b981"/><path d="M288 110l8 8 16-16" stroke="%23ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="180" font-family="sans-serif" font-size="22" font-weight="bold" fill="%230f172a" text-anchor="middle">TO'LOV MUVAFFAQIYATLI</text><text x="300" y="210" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">GREEN BOTANICA MCHJ</text><line x1="70" y1="240" x2="530" y2="240" stroke="%23e2e8f0" stroke-dasharray="6,6"/><text x="80" y="290" font-family="sans-serif" font-size="14" fill="%2364748b">Summa:</text><text x="520" y="290" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23047857" text-anchor="end">${totalAmount.toLocaleString()} UZS</text><text x="80" y="340" font-family="sans-serif" font-size="14" fill="%2364748b">Qabul qiluvchi karta:</text><text x="520" y="340" font-family="monospace" font-size="14" font-weight="bold" fill="%230f172a" text-anchor="end">8600 5304 9210 4402</text><text x="80" y="390" font-family="sans-serif" font-size="14" fill="%2364748b">Yuboruvchi karta:</text><text x="520" y="390" font-family="monospace" font-size="14" font-weight="bold" fill="%230f172a" text-anchor="end">${userCardNumber || '8600 •••• •••• ••••'}</text><text x="80" y="440" font-family="sans-serif" font-size="14" fill="%2364748b">Sana va vaqt:</text><text x="520" y="440" font-family="sans-serif" font-size="14" fill="%230f172a" text-anchor="end">${new Date().toLocaleString('uz-UZ')}</text><rect x="80" y="520" width="440" height="90" fill="%23ecfdf5" rx="12" stroke="%23a7f3d0"/><text x="300" y="560" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23065f46" text-anchor="middle">Plastik karta orqali to'lov tasdiqlangan</text><text x="300" y="585" font-family="sans-serif" font-size="11" fill="%23047857" text-anchor="middle">Kvitansiya tekshiruvdan o'tkazildi</text></svg>`;
    setReceiptPreview(sampleReceiptSvg);
    setReceiptFileName(`tolov_cheki_${Date.now()}.png`);
    showToast('Namuna to‘lov kvitansiyasi biriktirildi! 📄', 'success');
  };

  const handleNextStep = () => {
    if (step === 2) {
      // Sync address
      setSelectedAddress({
        id: selectedAddress?.id || `addr-${Date.now()}`,
        title: 'Yetkazish manzili',
        region: selectedRegion,
        cityDistrict,
        streetAddress,
        apartment,
        deliveryInstructions,
        isDefault: true,
      });
    }
    setStep(prev => (Math.min(5, prev + 1) as 1 | 2 | 3 | 4 | 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => (prev - 1) as 1 | 2 | 3 | 4 | 5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goBack();
    }
  };

  const handlePlaceOrder = async () => {
    if (!receiptPreview) {
      showToast('Iltimos, to‘lov chekini yuklang!', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const createdOrder = await placeCurrentOrder({
        userCardNumber,
        paymentReceiptUrl: receiptPreview,
        paymentReceiptName: receiptFileName || 'tolov-cheki.png',
      });
      if (createdOrder) {
        navigate({ type: 'order_detail', orderId: createdOrder.id });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Mijoz' },
    { num: 2, label: 'Manzil' },
    { num: 3, label: 'Yetkazish' },
    { num: 4, label: 'Karta raqami' },
    { num: 5, label: 'Biznes karta & Chek' },
  ];

  return (
    <div className="pb-32 space-y-4">
      {/* Header with Steps Progress */}
      <div className="px-4 pt-3 bg-white border-b border-stone-200 sticky top-12 z-30 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handlePrevStep}
            className="text-xs font-semibold text-stone-600 flex items-center gap-1 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Savatga' : 'Orqaga'}</span>
          </button>
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
            Bosqich {step} / 5: {stepsList[step - 1].label}
          </span>
        </div>

        {/* Progress pills */}
        <div className="flex gap-1.5">
          {stepsList.map(s => (
            <div
              key={s.num}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s.num <= step ? 'bg-emerald-700' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 1: Customer Information */}
      {step === 1 && (
        <div className="px-4 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-700" />
              <span>1-qadam: Mijoz ma'lumotlari</span>
            </h2>
            <p className="text-xs text-stone-500">
              Kuryer buyurtmani yetkazishda siz bilan bog'lanishi uchun ma'lumotlarni kiriting.
            </p>
          </div>

          <div className="space-y-3 bg-white border border-stone-200 rounded-2xl p-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Ism va familiyangiz *
              </label>
              <input
                id="checkout-name-input"
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Alisher Qodirov"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Telefon raqamingiz *
              </label>
              <input
                id="checkout-phone-input"
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Buyurtma holati haqida Telegram yoki SMS xabarnomasi yuboriladi
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Delivery Address (All 14 Uzbekistan Regions) */}
      {step === 2 && (
        <div className="px-4 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" />
              <span>2-qadam: Yetkazib berish manzili</span>
            </h2>
            <p className="text-xs text-stone-500">
              O'zbekistonning barcha 14 viloyatiga kuryer orqali yetkazamiz.
            </p>
          </div>

          <div className="space-y-3 bg-white border border-stone-200 rounded-2xl p-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Viloyat / Hudud *</label>
              <select
                id="checkout-region-select"
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value as UzbekistanRegion)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden cursor-pointer"
              >
                {UZBEKISTAN_REGIONS.map(reg => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Shahar yoki tuman *</label>
              <input
                id="checkout-city-input"
                type="text"
                value={cityDistrict}
                onChange={e => setCityDistrict(e.target.value)}
                placeholder="Chilonzor tumani"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Ko'cha, uy raqami *</label>
              <input
                id="checkout-street-input"
                type="text"
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
                placeholder="Chilonzor 9-mavze, 14-uy"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Xonadon / Ofis</label>
                <input
                  id="checkout-apt-input"
                  type="text"
                  value={apartment}
                  onChange={e => setApartment(e.target.value)}
                  placeholder="kv. 28"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mo'ljal</label>
                <input
                  type="text"
                  placeholder="Metro yoki do'kon"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Kuryer uchun qo'shimcha eslatma
              </label>
              <input
                id="checkout-instructions-input"
                type="text"
                value={deliveryInstructions}
                onChange={e => setDeliveryInstructions(e.target.value)}
                placeholder="Domofon kodi, 3-qavat va h.k."
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Delivery Method */}
      {step === 3 && (
        <div className="px-4 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-700" />
              <span>3-qadam: Yetkazib berish usuli</span>
            </h2>
            <p className="text-xs text-stone-500">
              Tanlangan hudud: <strong>{selectedRegion}</strong>
            </p>
          </div>

          <div className="space-y-2.5">
            {mockDeliveryMethods.map(method => {
              // Express is only for Tashkent shahri
              const isExpressDisabled = method.id === 'express' && selectedRegion !== 'Toshkent shahri';
              const isSelected = selectedDeliveryMethod === method.id;

              return (
                <div
                  key={method.id}
                  id={`delivery-method-card-${method.id}`}
                  onClick={() => {
                    if (!isExpressDisabled) setSelectedDeliveryMethod(method.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isExpressDisabled
                      ? 'opacity-40 bg-stone-50 border-stone-200 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-50/60 border-emerald-500 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-emerald-700 bg-emerald-700' : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900">{method.title}</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">{method.description}</p>
                        <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                          Vaqti: {method.estimatedTime}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-xs sm:text-sm text-stone-900">
                        {method.id === 'pickup'
                          ? 'Bepul'
                          : method.id === 'standard' && cartSubtotal >= 300000 && selectedRegion === 'Toshkent shahri'
                          ? 'Bepul'
                          : formatUZS(deliveryCalc.fee)}
                      </div>
                    </div>
                  </div>

                  {isExpressDisabled && (
                    <div className="text-[10px] text-rose-600 font-semibold mt-2 pl-8">
                      * Ekspress faqat Toshkent shahri ichida mavjud
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: User's 16-Digit Card Number Input */}
      {step === 4 && (
        <div className="px-4 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-700" />
              <span>4-qadam: 16 talik plastik karta raqamingizni kiriting</span>
            </h2>
            <p className="text-xs text-stone-500">
              O'zingizning bank kartangiz raqamini kiriting. Keyingi bosqichda to'lov qilish uchun kompaniyamiz biznes kartasi beriladi.
            </p>
          </div>

          {/* Interactive Live Card Display */}
          <div className="relative w-full rounded-[24px] p-5 overflow-hidden text-white bg-gradient-to-br from-[#0c1f38] via-[#153b68] to-[#08172e] shadow-xl border border-white/10">
            <div className="absolute -right-16 -top-16 w-52 h-52 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-500 p-[1.5px] shadow-sm border border-amber-600/60">
                  <div className="w-full h-full bg-amber-400/40 rounded-[2px] grid grid-cols-2 grid-rows-2 gap-[1px] p-[2px]">
                    <div className="border border-amber-700/40 rounded-[1px]" />
                    <div className="border border-amber-700/40 rounded-[1px]" />
                    <div className="border border-amber-700/40 rounded-[1px]" />
                    <div className="border border-amber-700/40 rounded-[1px]" />
                  </div>
                </div>
                <Wifi className="w-4 h-4 text-white/70 rotate-90" />
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 text-xs font-black tracking-wider">
                {rawDigitsOnly.startsWith('9860') ? 'HUMO' : rawDigitsOnly.startsWith('4') ? 'VISA' : 'UZCARD'}
              </div>
            </div>

            <div className="relative z-10 my-5">
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Karta raqami</div>
              <div className="font-mono text-lg sm:text-xl font-bold tracking-[0.2em] text-white drop-shadow-md">
                {userCardNumber || '•••• •••• •••• ••••'}
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between text-white/90">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-white/50">Karta egasi</div>
                <div className="text-xs font-bold tracking-wider uppercase mt-0.5">
                  {customerName ? customerName : 'MIJOZ'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-white/50">To'lovchi holati</div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{isCardValid ? "Karta to'liq" : `${rawDigitsOnly.length}/16 raqam`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form input for 16-digit card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Karta raqami (16 ta raqam) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="checkout-user-card-input"
                  type="text"
                  inputMode="numeric"
                  value={userCardNumber}
                  onChange={handleCardInputChange}
                  placeholder="8600 0000 0000 0000"
                  maxLength={19}
                  className="w-full py-3 px-3.5 pl-10 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono text-sm tracking-wider focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
                <CreditCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
              {!isCardValid && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Iltimos, kartangizning 16 ta raqamini to'liq kiriting (qolgan: {16 - rawDigitsOnly.length} ta)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Karta egasi (Ism va Familiya)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Masalan: Jamshid Aliyev"
                className="w-full py-2.5 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Karta raqamingiz xavfsiz tarzda saqlanadi va faqat buyurtmani identifikatsiya qilish uchun ishlatiladi.</span>
          </div>
        </div>
      )}

      {/* STEP 5: Official Business Card & Receipt Upload */}
      {step === 5 && (
        <div className="px-4 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-700" />
              <span>5-qadam: Biznes kartamizga to'lov & Chekni yuborish</span>
            </h2>
            <p className="text-xs text-stone-500">
              Quyidagi rasmiy biznes kartamizga kerakli summani to'lang va to'lov kvitansiyasini (cheki) yuklang.
            </p>
          </div>

          {/* Official Business Card presentation */}
          <div className="relative w-full rounded-[24px] p-5 overflow-hidden text-white bg-gradient-to-br from-[#063323] via-[#0b543b] to-[#042418] shadow-xl border border-emerald-500/30">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-300" />
                <span className="text-xs font-bold tracking-wider text-emerald-200">RASMIY BIZNES KARTA</span>
              </div>
              <div className="px-2.5 py-0.5 bg-emerald-400/20 border border-emerald-300/30 rounded-full text-[10px] font-bold text-emerald-100">
                {OFFICIAL_BUSINESS_CARD.bankName}
              </div>
            </div>

            <div className="relative z-10 my-4">
              <div className="text-[10px] uppercase tracking-wider text-emerald-200/70">To'lov uchun karta raqami</div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="font-mono text-lg sm:text-xl font-black tracking-[0.18em] text-white">
                  {OFFICIAL_BUSINESS_CARD.cardNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyBusinessCard}
                  className="px-3 py-1.5 bg-white text-stone-900 hover:bg-emerald-50 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 shrink-0"
                >
                  {copiedCard ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxalash</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative z-10 flex items-end justify-between pt-2 border-t border-white/10 text-white/90">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-emerald-200/70">Karta egasi</div>
                <div className="text-xs sm:text-sm font-bold tracking-wide uppercase mt-0.5">
                  {OFFICIAL_BUSINESS_CARD.cardHolder}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-emerald-200/70">To'lov summasi</div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base text-amber-300">
                    {formatUZS(totalAmount)}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    title="Summani nusxalash"
                    className="p-1 rounded bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  >
                    {copiedAmount ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Guidance */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>To'lov qilish bo'yicha ko'rsatma:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-stone-600">
              <li>Istalgan ilovangizni oching (Click, Payme, Uzum Bank, Anorbank va h.k.).</li>
              <li>Yuqoridagi biznes karta raqamiga aynan <strong>{formatUZS(totalAmount)}</strong> o'tkazing.</li>
              <li>O'tkazma yakunlangan kvitansiya yoki chek skrinshotini quyida yuklang.</li>
            </ol>
          </div>

          {/* Receipt Upload Zone */}
          <div className="bg-white border-2 border-dashed border-stone-300 rounded-[24px] p-5 text-center space-y-3">
            <div className="text-xs font-bold text-stone-900 flex items-center justify-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              <span>To'lov chekini (kvitansiya) yuklang</span>
              <span className="text-rose-500">*</span>
            </div>

            {receiptPreview ? (
              <div className="space-y-3">
                <div className="relative inline-block max-w-full rounded-2xl overflow-hidden border border-emerald-300 shadow-sm bg-stone-50 p-2">
                  <img
                    src={receiptPreview}
                    alt="To'lov cheki"
                    className="max-h-48 rounded-xl object-contain mx-auto"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs px-2">
                    <span className="font-medium text-emerald-800 truncate max-w-[200px]">
                      {receiptFileName || "To'lov cheki"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptPreview(null);
                        setReceiptFileName('');
                      }}
                      className="text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>O'chirish</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chek muvaffaqiyatli biriktirildi!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-500">
                  PNG, JPG yoki PDF formatidagi to'lov cheki rasmini yuklang
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <label className="py-2.5 px-5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-2 active:scale-95">
                    <UploadCloud className="w-4 h-4" />
                    <span>Faylni tanlash</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAttachSampleReceipt}
                    className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl border border-stone-200 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-600" />
                    <span>Namuna chekni biriktirish (Test)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Customer & Delivery Summary Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex justify-between items-start pb-2 border-b border-stone-100">
              <div>
                <span className="text-stone-400 uppercase tracking-wide text-[10px]">Qabul qiluvchi</span>
                <div className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5">{customerName}</div>
                <div className="text-stone-600">{phoneNumber}</div>
                <div className="text-stone-500 font-mono text-[11px] mt-0.5">Karta: {userCardNumber}</div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-emerald-700 font-semibold hover:underline"
              >
                O'zgartirish
              </button>
            </div>

            <div className="flex justify-between items-start pb-2 border-b border-stone-100">
              <div>
                <span className="text-stone-400 uppercase tracking-wide text-[10px]">Yetkazish manzili</span>
                <div className="font-bold text-stone-900 mt-0.5">
                  {selectedRegion}, {cityDistrict}
                </div>
                <div className="text-stone-600">
                  {streetAddress} {apartment ? `, ${apartment}` : ''}
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-emerald-700 font-semibold hover:underline"
              >
                O'zgartirish
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-stone-400 uppercase tracking-wide text-[10px]">Yetkazish usuli</span>
                <div className="font-bold text-stone-900">
                  {mockDeliveryMethods.find(m => m.id === selectedDeliveryMethod)?.title}
                </div>
              </div>
              <button
                onClick={() => setStep(3)}
                className="text-emerald-700 font-semibold hover:underline"
              >
                O'zgartirish
              </button>
            </div>
          </div>

          {/* Items Summary with Standard 46px Corners */}
          <div className="bg-white border border-stone-200 rounded-[46px] p-6 space-y-3 shadow-xs">
            <h3 className="font-bold text-stone-900 text-xs sm:text-sm">
              Buyurtma tarkibi ({cartTotalCount} ta mahsulot)
            </h3>
            <div className="space-y-2.5">
              {cart.map((item, idx) => (
                <div
                  key={item.id || `checkout-${item.product.id}-${item.selectedSize || 'std'}-${idx}`}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-11 h-11 object-cover rounded-xl shrink-0 border border-stone-200"
                    />
                    <div className="min-w-0">
                      <span className="font-medium text-stone-800 truncate block">{item.product.name}</span>
                      <span className="text-[11px] text-stone-400">
                        {item.quantity} x {formatUZS(item.product.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 shrink-0">
                    {formatUZS(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown with Standard 46px Corners */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-[46px] p-6 space-y-2 text-xs">
            <div className="flex justify-between text-stone-700">
              <span>Mahsulotlar jami:</span>
              <span>{formatUZS(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Yetkazib berish haqi:</span>
              <span>{deliveryFee === 0 ? 'Bepul' : formatUZS(deliveryFee)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Promokod chegirmasi ({appliedPromo?.code}):</span>
                <span>-{formatUZS(promoDiscount)}</span>
              </div>
            )}
            {usedBonusPoints > 0 && (
              <div className="flex justify-between text-amber-800 font-semibold">
                <span>Bonus chegirmasi:</span>
                <span>-{formatUZS(usedBonusPoints)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-emerald-200 flex justify-between items-baseline font-black text-sm sm:text-base text-emerald-950">
              <span>Jami to'lov:</span>
              <span>{formatUZS(totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ebebeb] p-3.5 shadow-shop-card max-w-[600px] mx-auto rounded-t-[28px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#787574] uppercase tracking-wider font-semibold">Jami to'lov</span>
            <div className="font-black text-[#000000] text-sm sm:text-base tracking-tight">{formatUZS(totalAmount)}</div>
          </div>

          {step < 5 ? (
            <button
              id={`checkout-next-step-${step}`}
              onClick={handleNextStep}
              disabled={step === 4 && !isCardValid}
              className="flex-1 py-3 px-5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>{step === 4 ? "Biznes kartani olish" : "Keyingi qadam"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="place-order-final-btn"
              onClick={handlePlaceOrder}
              disabled={submitting || !receiptPreview}
              className="flex-1 py-3.5 px-5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span>Tekshirilmoqda...</span>
              ) : (
                <>
                  <span>Chekni yuborish va Buyurtma berish</span>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
