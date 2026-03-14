import { useState, useCallback } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { OrderSidebar, CartItem } from '@/components/OrderSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Maximize, Minimize } from 'lucide-react';

export default function POSPage() {
  const { profile, role } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Sync state if user exits fullscreen via Escape
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
  };

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 border-b border-border flex items-center px-4 bg-card">
          <span className="text-sm font-semibold text-foreground">POS Terminal</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {profile?.full_name} • <span className="capitalize">{role}</span>
            </span>
            <button
              onClick={toggleFullscreen}
              className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ProductGrid onAdd={addToCart} />
        </div>
      </div>
      <div className="w-[380px] flex-shrink-0">
        <OrderSidebar cart={cart} setCart={setCart} />
      </div>
    </div>
  );
}
