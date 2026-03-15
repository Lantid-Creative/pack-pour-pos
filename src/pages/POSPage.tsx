import { useState, useCallback, useEffect } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { OrderSidebar, CartItem } from '@/components/OrderSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Maximize, Minimize, ShoppingCart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function POSPage() {
  const { profile, role } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileView, setMobileView] = useState<'products' | 'cart'>('products');
  const isMobile = useIsMobile();

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  document.onfullscreenchange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const addToCart = (product: { id: string; name: string; pack_size: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    // On mobile, stay on products view but show feedback via cart count
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex flex-col md:flex-row h-full bg-background">
      {/* Header */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 border-b border-border flex items-center px-4 bg-card shrink-0">
          <span className="text-sm font-semibold text-foreground">POS Terminal</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {profile?.full_name} • <span className="capitalize">{role}</span>
            </span>
            {!isMobile && (
              <button
                onClick={toggleFullscreen}
                className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            )}
          </span>
        </div>

        {/* Mobile: show products or cart based on tab */}
        {isMobile ? (
          <>
            <div className={`flex-1 overflow-hidden ${mobileView === 'products' ? 'block' : 'hidden'}`}>
              <ProductGrid onAdd={addToCart} />
            </div>
            <div className={`flex-1 overflow-hidden ${mobileView === 'cart' ? 'block' : 'hidden'}`}>
              <OrderSidebar cart={cart} setCart={setCart} onCheckoutComplete={() => setMobileView('products')} />
            </div>
            {/* Mobile bottom tab bar */}
            <div className="h-14 border-t border-border bg-card flex shrink-0">
              <button
                onClick={() => setMobileView('products')}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  mobileView === 'products' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Products
              </button>
              <button
                onClick={() => setMobileView('cart')}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors relative ${
                  mobileView === 'cart' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </div>
                Cart
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-hidden">
            <ProductGrid onAdd={addToCart} />
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="w-[380px] flex-shrink-0">
          <OrderSidebar cart={cart} setCart={setCart} />
        </div>
      )}
    </div>
  );
}
