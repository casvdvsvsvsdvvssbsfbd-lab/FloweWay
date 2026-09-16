import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppNotification,
  AppView,
  CartItem,
  DeliveryMethodType,
  NavigationTab,
  Order,
  OrderItem,
  PaymentMethodType,
  Product,
  ProductCategory,
  ProductSize,
  PromoCode,
  SavedForLaterItem,
  UserAddress,
  UserProfile,
} from '../types';
import { marketplaceService } from '../services/marketplaceService';
import { mockProducts } from '../data/mockProducts';

export const OFFICIAL_BUSINESS_CARD = {
  cardNumber: '8600 5304 9210 4402',
  cardNumberRaw: '8600530492104402',
  cardHolder: 'GREEN BOTANICA MCHJ',
  bankName: 'Kapitalbank ATB',
  phone: '+998 (90) 123-45-67',
  inn: '309482104',
};

interface AppContextType {
  // Navigation
  currentView: AppView;
  navigate: (view: AppView) => void;
  goBack: () => void;
  canGoBack: boolean;
  activeTab: NavigationTab;
  switchTab: (tab: NavigationTab) => void;

  // Products
  allProducts: Product[];
  addProduct: (product: Product) => void;
  openProduct: (productId: string) => void;
  openCategory: (categoryId: ProductCategory) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;

  // Cart
  cart: CartItem[];
  savedForLater: SavedForLaterItem[];
  addToCart: (product: Product, quantity?: number, size?: ProductSize) => void;
  removeFromCart: (productId: string, size?: ProductSize) => void;
  updateQuantity: (productId: string, quantity: number, size?: ProductSize) => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCartFromSaved: (productId: string) => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Favorites
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  favoriteProducts: Product[];

  // Promo & Bonus
  appliedPromo: PromoCode | null;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  usedBonusPoints: number;
  setUsedBonusPoints: (points: number) => void;

  // Checkout flow state
  selectedAddress: UserAddress | null;
  setSelectedAddress: (addr: UserAddress) => void;
  selectedDeliveryMethod: DeliveryMethodType;
  setSelectedDeliveryMethod: (method: DeliveryMethodType) => void;
  selectedPaymentMethod: PaymentMethodType;
  setSelectedPaymentMethod: (method: PaymentMethodType) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  deliveryInstructions: string;
  setDeliveryInstructions: (text: string) => void;
  placeCurrentOrder: (customData?: {
    userCardNumber?: string;
    paymentReceiptUrl?: string;
    paymentReceiptName?: string;
    directItems?: OrderItem[];
    customTotal?: number;
    customSubtotal?: number;
  }) => Promise<Order | null>;

  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;
  reorder: (order: Order) => void;

  // Profile & Addresses
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addresses: UserAddress[];
  addAddress: (addr: Omit<UserAddress, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  unreadNotifCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Toast
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation stack
  const [history, setHistory] = useState<AppView[]>([{ type: 'tab', tab: 'home' }]);
  const currentView = history[history.length - 1];

  // Derive active tab
  const activeTab: NavigationTab = currentView.type === 'tab' ? currentView.tab : 'home';

  // Products
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const addProduct = (product: Product) => {
    marketplaceService.addProduct(product);
    setAllProducts(prev => [product, ...prev]);
  };

  // Local storage helpers
  const CART_KEY = 'flowerway_cart_v1';
  const SAVED_KEY = 'flowerway_saved_v1';
  const FAVS_KEY = 'flowerway_favs_v1';

  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() =>
    getStored<CartItem[]>(CART_KEY, [
      { id: 'cart-item-monstera-L', product: mockProducts[0], quantity: 1, selectedSize: 'L' },
      { id: 'cart-item-terracotta-M', product: mockProducts[5], quantity: 1, selectedSize: 'M' },
    ])
  );
  const [savedForLater, setSavedForLater] = useState<SavedForLaterItem[]>(() =>
    getStored<SavedForLaterItem[]>(SAVED_KEY, [])
  );

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    getStored<string[]>(FAVS_KEY, ['prod-monstera-deliciosa', 'prod-phalaenopsis-orchid'])
  );

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedForLater));
    } catch {}
  }, [savedForLater]);

  useEffect(() => {
    try {
      localStorage.setItem(FAVS_KEY, JSON.stringify(favoriteIds));
    } catch {}
  }, [favoriteIds]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Addresses & Profile
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-alisher-01',
    fullName: 'Alisher Qodirov',
    phoneNumber: '+998 90 123 45 67',
    telegramUsername: '@alisher_botanist',
    email: 'alisher.qodirov@example.uz',
    preferredLanguage: 'uz',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bonusPoints: 45000,
    loyaltyLevel: 'Kumush',
    nextLevelPoints: 100000,
    totalOrdersCount: 2,
    memberSince: 'Fevral 2025',
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Checkout inputs
  const [customerName, setCustomerName] = useState<string>('Alisher Qodirov');
  const [phoneNumber, setPhoneNumber] = useState<string>('+998 90 123 45 67');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('Domofon: 28K');
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethodType>('standard');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('uzcard');

  // Promo & Bonus
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [usedBonusPoints, setUsedBonusPoints] = useState<number>(0);

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Initialize data on mount
  useEffect(() => {
    marketplaceService.getOrders().then(setOrders);
    marketplaceService.getAddresses().then(addrs => {
      setAddresses(addrs);
      const def = addrs.find(a => a.isDefault) || addrs[0] || null;
      setSelectedAddress(def);
    });
    marketplaceService.getProfile().then(setUserProfile);
    marketplaceService.getNotifications().then(setNotifications);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3000);
  };

  // Navigation handlers
  const navigate = (view: AppView) => {
    setHistory(prev => [...prev, view]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoBack = history.length > 1;

  const switchTab = (tab: NavigationTab) => {
    setHistory([{ type: 'tab', tab }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (productId: string) => {
    navigate({ type: 'product_detail', productId });
  };

  const openCategory = (categoryId: ProductCategory) => {
    navigate({ type: 'category_detail', categoryId });
  };

  // Cart logic
  const addToCart = (product: Product, quantity = 1, size?: ProductSize) => {
    const chosenSize = size || product.size;
    const generatedId = `cart-${product.id}-${chosenSize || 'std'}`;
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && (item.selectedSize === chosenSize || (!item.selectedSize && !chosenSize))
      );
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: generatedId, product, quantity, selectedSize: chosenSize }];
    });
    showToast(`"${product.name}" savatga qo'shildi! 🌿`);
  };

  const removeFromCart = (productId: string, size?: ProductSize) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && (size === undefined || item.selectedSize === size))));
    showToast("Mahsulot savatdan o'chirildi", 'info');
  };

  const updateQuantity = (productId: string, quantity: number, size?: ProductSize) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && (size === undefined || item.selectedSize === size)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoDiscount(0);
    setUsedBonusPoints(0);
  };

  const saveForLater = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      setSavedForLater(prev => [...prev, { product: item.product, savedAt: new Date().toLocaleDateString() }]);
      setCart(prev => prev.filter(i => i.product.id !== productId));
      showToast('Keyinroq sotib olish uchun saqlandi', 'info');
    }
  };

  const moveToCartFromSaved = (productId: string) => {
    const item = savedForLater.find(i => i.product.id === productId);
    if (item) {
      addToCart(item.product, 1);
      setSavedForLater(prev => prev.filter(i => i.product.id !== productId));
    }
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Favorites logic
  const toggleFavorite = (productId: string) => {
    setFavoriteIds(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Saralangandan olib tashlandi', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saralanganlarga saqlandi ❤️');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  const favoriteProducts = allProducts.filter(p => favoriteIds.includes(p.id));

  // Promo Code
  const applyPromoCode = (code: string) => {
    const res = marketplaceService.validatePromoCode(code, cartSubtotal);
    if (res.valid && res.promo) {
      setAppliedPromo(res.promo);
      setPromoDiscount(res.discount);
      showToast(res.message, 'success');
      return { success: true, message: res.message };
    } else {
      showToast(res.message, 'error');
      return { success: false, message: res.message };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    showToast('Promokod bekor qilindi', 'info');
  };

  // Place Order
  const placeCurrentOrder = async (customData?: {
    userCardNumber?: string;
    paymentReceiptUrl?: string;
    paymentReceiptName?: string;
    directItems?: OrderItem[];
    customTotal?: number;
    customSubtotal?: number;
  }): Promise<Order | null> => {
    const items: OrderItem[] = customData?.directItems || cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0],
      unitPrice: item.product.price,
      quantity: item.quantity,
      totalPrice: item.product.price * item.quantity,
    }));

    if (items.length === 0) {
      showToast("Xarid qilish uchun mahsulot tanlanmagan!", 'error');
      return null;
    }

    const addr = selectedAddress || {
      id: 'addr-temp',
      title: 'Kiritilgan manzil',
      region: 'Toshkent shahri',
      cityDistrict: 'Shahar markazi',
      streetAddress: 'Asosiy manzil',
      isDefault: true,
      deliveryInstructions,
    };

    const effectiveSubtotal = customData?.customSubtotal ?? (customData?.directItems ? customData.directItems.reduce((acc, i) => acc + i.totalPrice, 0) : cartSubtotal);
    const deliveryCalc = marketplaceService.calculateDeliveryFee(addr.region, selectedDeliveryMethod, effectiveSubtotal);
    const deliveryFee = deliveryCalc.fee;
    const finalTotal = customData?.customTotal ?? Math.max(0, effectiveSubtotal + deliveryFee - promoDiscount - usedBonusPoints);

    const orderPayload = {
      customerName: customerName.trim() || userProfile.fullName,
      phoneNumber: phoneNumber.trim() || userProfile.phoneNumber,
      deliveryAddress: addr,
      deliveryMethod: selectedDeliveryMethod,
      deliveryFee,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: 'paid' as const,
      items,
      subtotal: effectiveSubtotal,
      discountAmount: promoDiscount,
      appliedPromoCode: appliedPromo?.code,
      usedBonusPoints: usedBonusPoints,
      totalAmount: finalTotal,
      estimatedDeliveryTime: deliveryCalc.estimatedDays,
      courierNotes: deliveryInstructions,
      userCardNumber: customData?.userCardNumber,
      paymentReceiptUrl: customData?.paymentReceiptUrl,
      paymentReceiptName: customData?.paymentReceiptName,
      businessCard: {
        cardNumber: OFFICIAL_BUSINESS_CARD.cardNumber,
        cardHolder: OFFICIAL_BUSINESS_CARD.cardHolder,
        bankName: OFFICIAL_BUSINESS_CARD.bankName,
      },
    };

    const newOrder = await marketplaceService.createOrder(orderPayload);
    setOrders(prev => [newOrder, ...prev]);

    // Update user bonus points (give 3% cashback on order)
    const earnedBonus = Math.round(finalTotal * 0.03);
    setUserProfile(prev => ({
      ...prev,
      bonusPoints: Math.max(0, prev.bonusPoints - usedBonusPoints + earnedBonus),
      totalOrdersCount: prev.totalOrdersCount + 1,
    }));

    if (!customData?.directItems) {
      clearCart();
    }
    showToast(`Buyurtma #${newOrder.orderNumber} muvaffaqiyatli rasmiylashtirildi! 🎉`, 'success');
    return newOrder;
  };

  const refreshOrders = async () => {
    const list = await marketplaceService.getOrders();
    setOrders(list);
  };

  const reorder = (order: Order) => {
    let count = 0;
    order.items.forEach(item => {
      const prod = allProducts.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity);
        count++;
      }
    });
    if (count > 0) {
      showToast(`${count} ta mahsulot qayta savatga qo'shildi!`);
      navigate({ type: 'tab', tab: 'cart' });
    }
  };

  // Addresses
  const addAddress = async (addr: Omit<UserAddress, 'id'>) => {
    const created = await marketplaceService.addAddress(addr);
    const updated = await marketplaceService.getAddresses();
    setAddresses(updated);
    if (created.isDefault || !selectedAddress) {
      setSelectedAddress(created);
    }
    showToast('Yangi manzil saqlandi');
  };

  const deleteAddress = async (id: string) => {
    await marketplaceService.deleteAddress(id);
    const updated = await marketplaceService.getAddresses();
    setAddresses(updated);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
    }
    showToast('Manzil o\'chirildi', 'info');
  };

  const setDefaultAddress = async (id: string) => {
    await marketplaceService.setDefaultAddress(id);
    const updated = await marketplaceService.getAddresses();
    setAddresses(updated);
    const found = updated.find(a => a.id === id);
    if (found) setSelectedAddress(found);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await marketplaceService.updateProfile(updates);
    setUserProfile(updated);
    showToast('Profil ma\'lumotlari yangilandi');
  };

  // Notifications
  const markNotificationAsRead = async (id: string) => {
    await marketplaceService.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = async () => {
    await marketplaceService.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Barcha bildirishnomalar o\'qildi deb belgilandi');
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Hozirgina',
      read: false,
      ...notif,
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Yangi xabar: ${newNotif.title}`, 'info');
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigate,
        goBack,
        canGoBack,
        activeTab,
        switchTab,
        allProducts,
        addProduct,
        openProduct,
        openCategory,
        isAddProductModalOpen,
        setIsAddProductModalOpen,
        cart,
        savedForLater,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCartFromSaved,
        cartTotalCount,
        cartSubtotal,
        favoriteIds,
        toggleFavorite,
        isFavorite,
        favoriteProducts,
        appliedPromo,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        usedBonusPoints,
        setUsedBonusPoints,
        selectedAddress,
        setSelectedAddress,
        selectedDeliveryMethod,
        setSelectedDeliveryMethod,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        customerName,
        setCustomerName,
        phoneNumber,
        setPhoneNumber,
        deliveryInstructions,
        setDeliveryInstructions,
        placeCurrentOrder,
        orders,
        refreshOrders,
        reorder,
        userProfile,
        updateProfile,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        notifications,
        unreadNotifCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
