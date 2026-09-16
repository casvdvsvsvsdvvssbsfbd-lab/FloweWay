import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { SearchView } from './components/search/SearchView';
import { CartView } from './components/cart/CartView';
import { ProfileView } from './components/profile/ProfileView';
import { ProductDetailView } from './components/product/ProductDetailView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderDetailView } from './components/orders/OrderDetailView';
import { PlantCareGuideView } from './components/plantcare/PlantCareGuideView';
import { PlantEncyclopediaView } from './components/encyclopedia/PlantEncyclopediaView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { AddProductModal } from './components/seller/AddProductModal';
import { TelegramSettingsModal } from './components/telegram/TelegramSettingsModal';

const MainAppContent: React.FC = () => {
  const { currentView, isAddProductModalOpen, setIsAddProductModalOpen, goBack } = useApp();
  const [isTelegramModalOpen, setIsTelegramModalOpen] = React.useState(false);

  const getViewKey = () => {
    switch (currentView.type) {
      case 'tab':
        return `tab-${currentView.tab}`;
      case 'category_detail':
        return `category-${currentView.categoryId}`;
      case 'product_detail':
        return `product-${currentView.productId}`;
      case 'checkout':
        return 'checkout';
      case 'order_detail':
        return `order-${currentView.orderId}`;
      case 'plant_care_guide':
        return 'plant_care_guide';
      case 'encyclopedia':
        return 'encyclopedia';
      case 'favorites':
        return 'favorites';
      case 'notifications':
        return 'notifications';
      default:
        return 'home';
    }
  };

  const renderView = () => {
    switch (currentView.type) {
      case 'tab':
        switch (currentView.tab) {
          case 'home':
            return <HomeView />;
          case 'catalog':
            return <CatalogView />;
          case 'search':
            return <SearchView />;
          case 'cart':
            return <CartView />;
          case 'profile':
            return <ProfileView onOpenTelegramModal={() => setIsTelegramModalOpen(true)} />;
          default:
            return <HomeView />;
        }
      case 'category_detail':
        return <CatalogView initialCategory={currentView.categoryId} />;
      case 'product_detail':
        return <ProductDetailView productId={currentView.productId} />;
      case 'checkout':
        return <CheckoutView />;
      case 'order_detail':
        return <OrderDetailView orderId={currentView.orderId} />;
      case 'plant_care_guide':
        return <PlantCareGuideView />;
      case 'encyclopedia':
        return <PlantEncyclopediaView />;
      case 'telegram_settings':
        return <ProfileView onOpenTelegramModal={() => setIsTelegramModalOpen(true)} />;
      case 'favorites':
        return <FavoritesView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <HomeView />;
    }
  };

  const showBottomNav = currentView.type !== 'checkout';

  return (
    <div className="min-h-screen-dvh bg-[#faf7f2] text-[#1c1917] flex flex-col font-sans antialiased relative overflow-x-hidden">
      {/* Universal Sticky Header */}
      <Header />

      {/* Global Alerts & Toasts */}
      <Toast />

      {/* Main Content Area with Smooth Hardware-Accelerated Transitions */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-16 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={getViewKey()}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full gpu-layer"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Floating Glass Dock */}
      {showBottomNav && <BottomNav />}

      {/* Seller Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />

      {/* Telegram Bot Notification Settings Modal */}
      <TelegramSettingsModal
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
