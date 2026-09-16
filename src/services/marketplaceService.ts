import {
  AppNotification,
  DeliveryMethodOption,
  DeliveryMethodType,
  FilterOptions,
  Order,
  Product,
  ProductCategory,
  PromoCode,
  SortOption,
  UserAddress,
  UserProfile,
  UzbekistanRegion,
} from '../types';
import { mockCategories, mockDeliveryMethods, mockNotifications, mockOrders, mockPromoCodes, mockUserAddresses, mockUserProfile } from '../data/mockData';
import { mockProducts } from '../data/mockProducts';
import { matchesSearch } from '../utils/formatters';

export class MarketplaceService {
  private products: Product[] = [...mockProducts];
  private orders: Order[] = [...mockOrders];
  private addresses: UserAddress[] = [...mockUserAddresses];
  private notifications: AppNotification[] = [...mockNotifications];
  private profile: UserProfile = { ...mockUserProfile };

  // Products & Filtering
  addProduct(product: Product): void {
    this.products.unshift(product);
  }

  async getProducts(filters?: FilterOptions, sort: SortOption = 'recommended'): Promise<Product[]> {
    let result = [...this.products];

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        result = result.filter(p => p.category === filters.category);
      }

      if (filters.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.trim();
        result = result.filter(p => {
          const inName = matchesSearch(p.name, q);
          const inLatin = p.latinName ? matchesSearch(p.latinName, q) : false;
          const inUzbek = p.uzbekName ? matchesSearch(p.uzbekName, q) : false;
          const inBrand = matchesSearch(p.brand, q);
          const inCategory = matchesSearch(p.category, q);
          const inTags = p.tags.some(t => matchesSearch(t, q));
          const inDesc = matchesSearch(p.description, q);
          return inName || inLatin || inUzbek || inBrand || inCategory || inTags || inDesc;
        });
      }

      if (filters.minPrice !== undefined) {
        result = result.filter(p => p.price >= (filters.minPrice ?? 0));
      }

      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        result = result.filter(p => p.price <= (filters.maxPrice ?? Infinity));
      }

      if (filters.inStockOnly) {
        result = result.filter(p => p.inStock);
      }

      if (filters.minRating) {
        result = result.filter(p => p.rating >= (filters.minRating ?? 0));
      }

      if (filters.discountedOnly) {
        result = result.filter(p => (p.discountPercent ?? 0) > 0);
      }

      if (filters.selectedBrands && filters.selectedBrands.length > 0) {
        result = result.filter(p => filters.selectedBrands?.includes(p.brand));
      }

      if (filters.selectedSizes && filters.selectedSizes.length > 0) {
        result = result.filter(p => p.size && filters.selectedSizes?.includes(p.size));
      }

      if (filters.plantDifficulty && filters.plantDifficulty.length > 0) {
        result = result.filter(p => p.plantCare && filters.plantDifficulty?.includes(p.plantCare.difficulty));
      }
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'highest_rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'biggest_discount':
        result.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
    }

    return result;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getCategories() {
    return mockCategories;
  }

  async getCategoryById(id: ProductCategory) {
    return mockCategories.find(c => c.id === id);
  }

  async getRecommendations(productId: string): Promise<{
    recommendedPot?: Product;
    recommendedSoil?: Product;
    recommendedFertilizer?: Product;
    recommendedAccessory?: Product;
    relatedProducts: Product[];
  }> {
    const product = await this.getProductById(productId);
    if (!product) return { relatedProducts: [] };

    const pot = product.recommendedPotId ? await this.getProductById(product.recommendedPotId) : undefined;
    const soil = product.recommendedSoilId ? await this.getProductById(product.recommendedSoilId) : undefined;
    const fertilizer = product.recommendedFertilizerId ? await this.getProductById(product.recommendedFertilizerId) : undefined;
    const accessory = product.recommendedAccessoryId ? await this.getProductById(product.recommendedAccessoryId) : undefined;

    const related: Product[] = [];
    const seenIds = new Set<string>();
    if (product.relatedProductIds) {
      for (const relId of product.relatedProductIds) {
        if (relId !== productId && !seenIds.has(relId)) {
          seenIds.add(relId);
          const item = await this.getProductById(relId);
          if (item) related.push(item);
        }
      }
    }

    return {
      recommendedPot: pot,
      recommendedSoil: soil,
      recommendedFertilizer: fertilizer,
      recommendedAccessory: accessory,
      relatedProducts: related,
    };
  }

  async getFrequentlyBoughtTogether(productId: string): Promise<Product[]> {
    const product = await this.getProductById(productId);
    if (!product || !product.frequentlyBoughtTogetherIds) return [];

    const items: Product[] = [];
    for (const id of product.frequentlyBoughtTogetherIds) {
      const item = await this.getProductById(id);
      if (item) items.push(item);
    }
    return items;
  }

  // Delivery Calculation Abstraction
  calculateDeliveryFee(
    region: UzbekistanRegion,
    method: DeliveryMethodType,
    cartSubtotal: number
  ): { fee: number; note: string; estimatedDays: string } {
    if (method === 'pickup') {
      return { fee: 0, note: 'Bepul (Samovivoz)', estimatedDays: 'Bugun tayyor' };
    }

    if (method === 'express') {
      return { fee: 50000, note: 'Ekspress tezkor yetkazish', estimatedDays: '2-3 soat' };
    }

    // Standard delivery logic
    // Free delivery in Tashkent if subtotal >= 300,000 UZS
    const isTashkentCity = region === 'Toshkent shahri';
    if (isTashkentCity && cartSubtotal >= 300000) {
      return { fee: 0, note: 'Bepul yetkazib berish (300 000 so\'mdan yuqori)', estimatedDays: '1-2 kun' };
    }

    // Regional fees
    if (isTashkentCity || region === 'Toshkent viloyati') {
      return { fee: 25000, note: 'Standart kuryer', estimatedDays: '1-2 kun' };
    }

    // Regions outside Tashkent
    return { fee: 35000, note: 'O\'zbekiston bo\'ylab pochta/kuryer', estimatedDays: '2-4 kun' };
  }

  // Promo codes
  validatePromoCode(code: string, subtotal: number): { valid: boolean; promo?: PromoCode; discount: number; message: string } {
    const clean = code.trim().toUpperCase();
    const promo = mockPromoCodes.find(p => p.code === clean);

    if (!promo) {
      return { valid: false, discount: 0, message: 'Bunday promokod topilmadi' };
    }

    if (subtotal < promo.minimumOrderAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Ushbu promokod minimal ${promo.minimumOrderAmount.toLocaleString()} so'mdan yuqori xaridlar uchun amal qiladi`,
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round((subtotal * promo.discountValue) / 100);
    } else if (promo.discountType === 'fixed') {
      discount = promo.discountValue;
    } else if (promo.discountType === 'free_delivery') {
      discount = 25000;
    }

    return {
      valid: true,
      promo,
      discount,
      message: `${promo.description} muvaffaqiyatli qo'llandi!`,
    };
  }

  // Orders
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'currentStatus' | 'statusHistory'>): Promise<Order> {
    const id = `ord-pm-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderNumber = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const createdAt = `${now.toLocaleDateString('uz-UZ')}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt,
      currentStatus: 'Order received',
      statusHistory: [
        {
          status: 'Order received',
          timestamp: createdAt,
          description: 'Buyurtma tizimga qabul qilindi va mutaxassisga yo\'naltirildi',
          completed: true,
        },
        {
          status: 'Confirmed',
          timestamp: 'Kutilmoqda (5-10 daqiqa)',
          description: 'Menejer buyurtmani tasdiqlaydi',
          completed: false,
        },
        {
          status: 'Preparing',
          timestamp: 'Tayyorlanadi',
          description: 'O\'simlik va ashyolar ehtiyotkorlik bilan qadoqlanadi',
          completed: false,
        },
        {
          status: 'Assigned to courier',
          timestamp: 'Kuryer tayinlanadi',
          description: 'Kuryer raqami SMS/Telegram orqali yuboriladi',
          completed: false,
        },
        {
          status: 'On the way',
          timestamp: 'Yo\'lga chiqadi',
          description: 'Kuryer manzil tomon harakatlanadi',
          completed: false,
        },
        {
          status: 'Delivered',
          timestamp: 'Yetkaziladi',
          description: 'Mijozga topshiriladi',
          completed: false,
        },
      ],
    };

    this.orders.unshift(newOrder);

    // Also add an automatic notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: `Yangi buyurtma qabul qilindi: ${orderNumber} 🌿`,
      message: `${orderData.items.length} ta mahsulot uchun buyurtmangiz tayyorlanishga yuborildi.`,
      timestamp: 'Hozirgina',
      read: false,
      type: 'order',
      targetOrderId: id,
    });

    return newOrder;
  }

  async getOrders(): Promise<Order[]> {
    return this.orders;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  // Addresses
  async getAddresses(): Promise<UserAddress[]> {
    return this.addresses;
  }

  async addAddress(address: Omit<UserAddress, 'id'>): Promise<UserAddress> {
    const newAddr: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    if (newAddr.isDefault) {
      this.addresses.forEach(a => (a.isDefault = false));
    }
    this.addresses.push(newAddr);
    return newAddr;
  }

  async deleteAddress(id: string): Promise<void> {
    this.addresses = this.addresses.filter(a => a.id !== id);
  }

  async setDefaultAddress(id: string): Promise<void> {
    this.addresses.forEach(a => {
      a.isDefault = a.id === id;
    });
  }

  // Profile
  async getProfile(): Promise<UserProfile> {
    return this.profile;
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    this.profile = { ...this.profile, ...updates };
    return this.profile;
  }

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    return this.notifications;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const n = this.notifications.find(item => item.id === id);
    if (n) n.read = true;
  }

  async markAllNotificationsAsRead(): Promise<void> {
    this.notifications.forEach(n => (n.read = true));
  }
}

export const marketplaceService = new MarketplaceService();
