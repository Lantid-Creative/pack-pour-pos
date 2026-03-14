import { useState } from 'react';
import { ProductGrid } from '@/components/ProductGrid';
import { OrderSidebar, CartItem } from '@/components/OrderSidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function POSPage() {
  const { profile, role } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

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
          <span className="ml-auto text-xs text-muted-foreground">
            {profile?.full_name} • <span className="capitalize">{role}</span>
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
