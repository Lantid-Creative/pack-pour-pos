import { ProductGrid } from '@/components/ProductGrid';
import { OrderSidebar } from '@/components/OrderSidebar';
import { useAppStore } from '@/lib/store';

export default function POSPage() {
  const { currentUser, currentRole } = useAppStore();

  return (
    <div className="flex h-screen bg-background">
      {/* Product Grid - Left */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 border-b border-border flex items-center px-4 bg-card">
          <span className="text-sm font-semibold text-foreground">POS Terminal</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {currentUser} • <span className="capitalize">{currentRole}</span>
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ProductGrid />
        </div>
      </div>

      {/* Order Sidebar - Right */}
      <div className="w-[380px] flex-shrink-0">
        <OrderSidebar />
      </div>
    </div>
  );
}
