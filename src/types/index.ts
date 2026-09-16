export type ProductCategory =
  | 'live-plants'
  | 'roses'
  | 'bouquets'
  | 'orchids'
  | 'exotic-plants'
  | 'bonsai'
  | 'pots-planters'
  | 'soil-substrates'
  | 'fertilizers'
  | 'plant-medicine'
  | 'plant-care'
  | 'gardening-accessories'
  | 'bundles'
  | 'gift-sets'
  | 'women'
  | 'men'
  | 'beauty'
  | 'home'
  | 'fitness-nutrition'
  | 'baby-toddler'
  | 'food-drinks';

export type PlantDifficulty = 'Easy' | 'Moderate' | 'Demanding';
export type PlantLight = 'Low light' | 'Bright indirect' | 'Direct sunlight' | 'Partial shade';
export type PlantWatering = 'Once a week' | 'Twice a week' | 'When soil dries' | 'Keep moist';
export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface PlantCareInfo {
  light: PlantLight;
  watering: PlantWatering;
  temperature: string;
  soilType: string;
  difficulty: PlantDifficulty;
  suitableLocation: string;
  humidity?: string;
  petSafe?: boolean;
}

export interface MedicineFertilizerInfo {
  purpose: string;
  usageInstructions: string;
  suitablePlants: string[];
  packageSize: string;
  activeIngredients?: string;
  safetyCaution: string;
}

export interface BundleItemDetail {
  productId: string;
  name: string;
  category: ProductCategory;
  quantity: number;
}

export interface Seller {
  id: string;
  name: string;
  rating: number;
  city: string;
  verified: boolean;
  totalProducts: number;
  deliveryTimeDays: string;
}

export interface Review {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  latinName?: string;
  uzbekName?: string;
  category: ProductCategory;
  price: number; // in UZS (so'm)
  oldPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  images: string[];
  description: string;
  shortDescription: string;
  brand: string;
  size?: ProductSize;
  dimensions?: string;
  weightKg?: number;
  isPopular?: boolean;
  isNewArrival?: boolean;
  isDiscounted?: boolean;
  isFeatured?: boolean;
  tags: string[];
  
  // Specific category metadata
  plantCare?: PlantCareInfo;
  medicineFertilizer?: MedicineFertilizerInfo;
  bundleItems?: BundleItemDetail[];

  // Multi-vendor architecture readiness
  sellerId: string;
  seller: Seller;

  // Recommendations links
  recommendedPotId?: string;
  recommendedSoilId?: string;
  recommendedFertilizerId?: string;
  recommendedAccessoryId?: string;
  frequentlyBoughtTogetherIds?: string[];
  relatedProductIds?: string[];
}

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
}

export interface SavedForLaterItem {
  product: Product;
  savedAt: string;
}

export type UzbekistanRegion =
  | 'Toshkent shahri'
  | 'Toshkent viloyati'
  | 'Samarqand'
  | 'Buxoro'
  | 'Farg\'ona'
  | 'Andijon'
  | 'Namangan'
  | 'Qashqadaryo'
  | 'Surxondaryo'
  | 'Xorazm'
  | 'Navoiy'
  | 'Jizzax'
  | 'Sirdaryo'
  | 'Qoraqalpog\'iston Respublikasi';

export interface UserAddress {
  id: string;
  title: string; // e.g. "Uy", "Ishxona"
  region: UzbekistanRegion;
  cityDistrict: string;
  streetAddress: string;
  apartment?: string;
  landmark?: string;
  deliveryInstructions?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  telegramUsername?: string;
  email?: string;
  preferredLanguage: 'uz' | 'ru' | 'en';
  avatarUrl?: string;
  bonusPoints: number;
  loyaltyLevel: 'Bronza' | 'Kumush' | 'Oltin' | 'Zümrad';
  nextLevelPoints: number;
  totalOrdersCount: number;
  memberSince: string;
}

export interface BonusTransaction {
  id: string;
  date: string;
  type: 'earned' | 'used' | 'expired';
  points: number;
  description: string;
  orderId?: string;
}

export type DeliveryMethodType = 'standard' | 'express' | 'pickup';

export interface DeliveryMethodOption {
  id: DeliveryMethodType;
  title: string;
  description: string;
  baseFee: number; // in UZS
  estimatedTime: string;
  availableRegions: UzbekistanRegion[] | 'all';
}

export type PaymentMethodType = 'uzcard' | 'humo' | 'visa' | 'click' | 'payme' | 'uzum' | 'uzcard_humo' | 'cash';

export interface PaymentMethodOption {
  id: PaymentMethodType;
  title: string;
  subtitle: string;
  iconName: string;
  badge?: string;
}

export type OrderStatus =
  | 'Order received'
  | 'Confirmed'
  | 'Preparing'
  | 'Assigned to courier'
  | 'On the way'
  | 'Delivered'
  | 'Cancelled';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: UserAddress;
  deliveryMethod: DeliveryMethodType;
  deliveryFee: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'paid' | 'pay_on_delivery';
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  appliedPromoCode?: string;
  usedBonusPoints?: number;
  totalAmount: number;
  currentStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  estimatedDeliveryTime: string;
  courierNotes?: string;
  userCardNumber?: string;
  paymentReceiptUrl?: string;
  paymentReceiptName?: string;
  businessCard?: {
    cardNumber: string;
    cardHolder: string;
    bankName: string;
  };
}

export interface PromoCode {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number; // percentage (e.g. 15) or fixed amount in UZS
  minimumOrderAmount: number;
  expiresAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'promotion' | 'plant_care' | 'delivery' | 'bonus';
  targetOrderId?: string;
}

export interface FilterOptions {
  category?: ProductCategory | 'all';
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  minRating?: number;
  selectedBrands?: string[];
  selectedSizes?: ProductSize[];
  discountedOnly?: boolean;
  plantDifficulty?: PlantDifficulty[];
  plantLight?: PlantLight[];
}

export type SortOption =
  | 'recommended'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'highest_rated'
  | 'biggest_discount';

export type NavigationTab = 'home' | 'catalog' | 'search' | 'cart' | 'profile';

export interface TelegramBotSettings {
  enabled: boolean;
  botUsername: string;
  chatId: string;
  orderStatusAlerts: boolean;
  paymentReceiptAlerts: boolean;
  careReminders: boolean;
  promoAlerts: boolean;
}

export interface PlantEncyclopediaItem {
  id: string;
  uzbekName: string;
  latinName: string;
  russianName?: string;
  category: string;
  difficulty: 'Oson' | "O'rtacha" | 'Tajriba talab';
  imageUrl: string;
  shortSummary: string;
  uzbekistanClimateTips: string;
  wateringSummer: string;
  wateringWinter: string;
  lightRequirements: string;
  temperatureRange: string;
  humidityLevel: string;
  recommendedPot: string;
  petSafe: boolean;
  airPurifying: boolean;
  heatResistant: boolean;
  lowLightTolerant: boolean;
  droughtTolerant: boolean;
  soilRecommendation: string;
  fertilizerSchedule: string;
  commonProblems: { symptom: string; solution: string }[];
  associatedProductId?: string;
}

export interface EncyclopediaArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  imageUrl: string;
  summary: string;
  content: string[];
  tips: string[];
  tags: string[];
}

export type AppView =
  | { type: 'tab'; tab: NavigationTab }
  | { type: 'product_detail'; productId: string; previousView?: AppView }
  | { type: 'category_detail'; categoryId: ProductCategory; previousView?: AppView }
  | { type: 'checkout'; previousView?: AppView }
  | { type: 'order_detail'; orderId: string; previousView?: AppView }
  | { type: 'order_history'; previousView?: AppView }
  | { type: 'favorites'; previousView?: AppView }
  | { type: 'notifications'; previousView?: AppView }
  | { type: 'loyalty'; previousView?: AppView }
  | { type: 'addresses'; previousView?: AppView }
  | { type: 'plant_care_guide'; previousView?: AppView }
  | { type: 'encyclopedia'; previousView?: AppView }
  | { type: 'telegram_settings'; previousView?: AppView };
