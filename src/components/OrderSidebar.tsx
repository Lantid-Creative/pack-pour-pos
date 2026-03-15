import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { ReceiptDialog } from './ReceiptDialog';
import { toast } from 'sonner';

interface CartProduct {
  id: string;
  name: string;
  pack_size: string;
  price: number;
  bulk_price?: number | null;
  bulk_min_quantity?: number | null;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

type PaymentMethod = 'cash' | 'pos' | 'transfer';

interface CompletedSale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  cashier: string;
  date: string;
}

export function OrderSidebar({ cart, setCart, onCheckoutComplete }: { cart: CartItem[]; setCart: (c: CartItem[]) => void; onCheckoutComplete?: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<CompletedSale | null>(null);
  const [processing, setProcessing] = useState(false);
  const { user, profile, storeId } = useAuth();
  const queryClient = useQueryClient();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter((i) => i.product.id !== productId));
    } else {
      setCart(cart.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)));
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0 || !user || !storeId) return;
    setProcessing(true);
    try {
      const items = cart.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        pack_size: i.product.pack_size,
        quantity: i.quantity,
        unit_price: i.product.price,
      }));

      const { data, error } = await supabase.rpc('complete_sale', {
        p_store_id: storeId,
        p_cashier_id: user.id,
        p_cashier_name: profile?.full_name || user.email || '',
        p_total: total,
        p_payment_method: paymentMethod,
        p_items: items,
      });

      if (error) throw error;

      const sale: CompletedSale = {
        id: data as string,
        items: [...cart],
        total,
        paymentMethod,
        cashier: profile?.full_name || '',
        date: new Date().toLocaleDateString('en-NG'),
      };

      setLastSale(sale);
      setShowReceipt(true);
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Sale completed!');
      onCheckoutComplete?.();
    } catch (err: any) {
      toast.error(err.message || 'Sale failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg text-foreground">Current Order</h2>
          <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            {cart.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-2 opacity-30" />
            <p className="text-sm">No items in order</p>
            <p className="text-xs">Tap products to add</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{item.product.pack_size}</p>
                <p className="font-mono-numbers text-sm font-semibold text-primary">
                  ₦{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="h-7 w-7 rounded bg-muted flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono-numbers w-8 text-center text-sm font-bold">{item.quantity}</span>
                <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="h-7 w-7 rounded bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setCart(cart.filter((i) => i.product.id !== item.product.id))} className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors ml-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border p-4 space-y-3">
        <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg">
          {(['cash', 'pos', 'transfer'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`py-2 text-xs font-bold uppercase rounded-md transition-all ${
                paymentMethod === method ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="font-mono-numbers text-2xl font-bold text-foreground">₦{total.toLocaleString()}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setCart([])} disabled={cart.length === 0} className="flex-1 py-3 rounded-lg border border-destructive text-destructive font-semibold text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            VOID
          </button>
          <button onClick={handleCheckout} disabled={cart.length === 0 || processing} className="flex-[2] py-3 rounded-lg bg-primary text-primary-foreground font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {processing ? 'Processing...' : `CHECKOUT — ₦${total.toLocaleString()}`}
          </button>
        </div>
      </div>

      {lastSale && <ReceiptDialog sale={lastSale} open={showReceipt} onClose={() => setShowReceipt(false)} />}
    </div>
  );
}
