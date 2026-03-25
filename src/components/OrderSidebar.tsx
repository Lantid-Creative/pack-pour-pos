import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Minus, Plus, Trash2, ShoppingCart, UserPlus, Package, Split } from 'lucide-react';
import { ReceiptDialog } from './ReceiptDialog';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CartProduct {
  id: string;
  name: string;
  pack_size: string;
  price: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

type PaymentMethod = 'cash' | 'pos' | 'transfer' | 'credit';

interface PaymentSplit {
  method: PaymentMethod;
  amount: number;
}

interface CrateInfo {
  productId: string;
  productName: string;
  cratesRequired: number;
  cratesBrought: number;
  depositPerCrate: number;
}

interface CompletedSale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  cashier: string;
  date: string;
  crateDeposits?: CrateInfo[];
  paymentSplits?: PaymentSplit[];
}

export function OrderSidebar({ cart, setCart, onCheckoutComplete }: { cart: CartItem[]; setCart: (c: CartItem[]) => void; onCheckoutComplete?: () => void }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [paymentSplits, setPaymentSplits] = useState<PaymentSplit[]>([
    { method: 'cash', amount: 0 },
    { method: 'transfer', amount: 0 },
  ]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<CompletedSale | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [addingCustomer, setAddingCustomer] = useState(false);

  // Crate state
  const [showCrateDialog, setShowCrateDialog] = useState(false);
  const [crateInfoMap, setCrateInfoMap] = useState<Record<string, number>>({});
  const [pendingCheckout, setPendingCheckout] = useState(false);

  const { user, profile, storeId } = useAuth();
  const queryClient = useQueryClient();

  const { data: allTiers = [] } = useQuery({
    queryKey: ['product_price_tiers', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('product_price_tiers' as any).select('*').eq('store_id', storeId).order('min_quantity');
      if (error) throw error;
      return data as any[];
    },
    enabled: !!storeId,
  });

  const { data: storeSettings } = useQuery({
    queryKey: ['store-settings', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const { data, error } = await supabase.from('stores').select('*').eq('id', storeId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const { data: surchargeRules = [] } = useQuery({
    queryKey: ['surcharges', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('surcharges' as any).select('*').eq('store_id', storeId).eq('enabled', true).order('min_amount');
      if (error) throw error;
      return data as any[];
    },
    enabled: !!storeId,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('products').select('*').eq('store_id', storeId);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!storeId,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('customers').select('*').eq('store_id', storeId).order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const crateProductsInCart = useMemo(() => {
    return cart.filter(item => {
      const prod = allProducts.find((p: any) => p.id === item.product.id);
      return prod?.is_crate_product;
    }).map(item => {
      const prod = allProducts.find((p: any) => p.id === item.product.id);
      return {
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        depositPerCrate: Number(prod?.crate_deposit_amount || 0),
      };
    });
  }, [cart, allProducts]);

  const getEffectivePrice = (item: CartItem) => {
    const productTiers = allTiers
      .filter((t: any) => t.product_id === item.product.id)
      .sort((a: any, b: any) => b.min_quantity - a.min_quantity);
    for (const tier of productTiers) {
      const minOk = item.quantity >= tier.min_quantity;
      const maxOk = !tier.max_quantity || item.quantity <= tier.max_quantity;
      if (minOk && maxOk) return Number(tier.price);
    }
    return item.product.price;
  };

  const getAppliedTier = (item: CartItem) => {
    const productTiers = allTiers
      .filter((t: any) => t.product_id === item.product.id)
      .sort((a: any, b: any) => b.min_quantity - a.min_quantity);
    for (const tier of productTiers) {
      const minOk = item.quantity >= tier.min_quantity;
      const maxOk = !tier.max_quantity || item.quantity <= tier.max_quantity;
      if (minOk && maxOk) return tier;
    }
    return null;
  };

  const crateDepositTotal = useMemo(() => {
    let total = 0;
    for (const cp of crateProductsInCart) {
      const brought = crateInfoMap[cp.productId] || 0;
      const owed = Math.max(0, cp.quantity - brought);
      total += owed * cp.depositPerCrate;
    }
    return total;
  }, [crateProductsInCart, crateInfoMap]);

  const subtotal = cart.reduce((sum, item) => sum + getEffectivePrice(item) * item.quantity, 0);
  const total = subtotal + crateDepositTotal;

  // Split payment helpers
  const splitTotal = paymentSplits.reduce((s, p) => s + p.amount, 0);
  const splitRemaining = total - splitTotal;
  const hasCreditSplit = paymentSplits.some(s => s.method === 'credit' && s.amount > 0);
  const needsCustomerForSplit = isSplitPayment && hasCreditSplit;

  const availableSplitMethods: PaymentMethod[] = ['cash', 'pos', 'transfer', 'credit'];

  const addSplitMethod = () => {
    const usedMethods = paymentSplits.map(s => s.method);
    const nextMethod = availableSplitMethods.find(m => !usedMethods.includes(m));
    if (nextMethod) {
      setPaymentSplits([...paymentSplits, { method: nextMethod, amount: 0 }]);
    }
  };

  const removeSplitMethod = (index: number) => {
    if (paymentSplits.length <= 2) return;
    setPaymentSplits(paymentSplits.filter((_, i) => i !== index));
  };

  const updateSplitMethod = (index: number, method: PaymentMethod) => {
    setPaymentSplits(paymentSplits.map((s, i) => i === index ? { ...s, method } : s));
  };

  const updateSplitAmount = (index: number, amount: number) => {
    setPaymentSplits(paymentSplits.map((s, i) => i === index ? { ...s, amount } : s));
  };

  const fillRemainingToSplit = (index: number) => {
    const othersTotal = paymentSplits.reduce((s, p, i) => i === index ? s : s + p.amount, 0);
    const remaining = total - othersTotal;
    updateSplitAmount(index, Math.max(0, remaining));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter((i) => i.product.id !== productId));
      setCrateInfoMap(prev => { const n = { ...prev }; delete n[productId]; return n; });
    } else {
      setCart(cart.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i)));
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomerName.trim() || !storeId) return;
    setAddingCustomer(true);
    try {
      const { data, error } = await supabase.from('customers').insert({ store_id: storeId, name: newCustomerName.trim() }).select().single();
      if (error) throw error;
      setSelectedCustomerId(data.id);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setShowAddCustomer(false);
      setNewCustomerName('');
      toast.success('Customer added');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAddingCustomer(false);
    }
  };

  const initiateCheckout = () => {
    if (cart.length === 0 || !user || !storeId) return;

    // Validate credit needs customer
    if (!isSplitPayment && paymentMethod === 'credit' && !selectedCustomerId) {
      toast.error('Please select a customer for credit sale');
      return;
    }
    if (needsCustomerForSplit && !selectedCustomerId) {
      toast.error('Please select a customer for the credit portion');
      return;
    }

    // Validate split amounts
    if (isSplitPayment) {
      if (Math.abs(splitRemaining) > 0.01) {
        toast.error(`Split amounts must equal ₦${total.toLocaleString()}. Remaining: ₦${splitRemaining.toLocaleString()}`);
        return;
      }
      const activeSplits = paymentSplits.filter(s => s.amount > 0);
      if (activeSplits.length < 2) {
        toast.error('Split payment requires at least 2 methods with amounts');
        return;
      }
    }

    if (crateProductsInCart.length > 0) {
      setShowCrateDialog(true);
      return;
    }

    performCheckout();
  };

  const performCheckout = async () => {
    if (cart.length === 0 || !user || !storeId) return;
    setProcessing(true);
    setPendingCheckout(false);
    try {
      const items = cart.map((i) => {
        const effectivePrice = getEffectivePrice(i);
        return {
          product_id: i.product.id,
          product_name: i.product.name,
          pack_size: i.product.pack_size,
          quantity: i.quantity,
          unit_price: effectivePrice,
        };
      });

      // Determine the primary payment method
      const primaryMethod = isSplitPayment ? 'split' : paymentMethod;

      const { data, error } = await supabase.rpc('complete_sale', {
        p_store_id: storeId,
        p_cashier_id: user.id,
        p_cashier_name: profile?.full_name || user.email || '',
        p_total: total,
        p_payment_method: primaryMethod as any,
        p_items: items,
      });

      if (error) throw error;

      const saleId = data as string;

      // Record split payment details
      const activeSplits = isSplitPayment ? paymentSplits.filter(s => s.amount > 0) : [];
      if (isSplitPayment && activeSplits.length > 0) {
        const splitInserts = activeSplits.map(s => ({
          sale_id: saleId,
          store_id: storeId,
          payment_method: s.method,
          amount: s.amount,
        }));
        await supabase.from('sale_payments' as any).insert(splitInserts);
      }

      // If credit (single or split with credit), update customer and credit status
      const isCredit = (!isSplitPayment && paymentMethod === 'credit') || (isSplitPayment && hasCreditSplit);
      if (isCredit && selectedCustomerId) {
        const creditAmount = isSplitPayment
          ? paymentSplits.find(s => s.method === 'credit')?.amount || 0
          : total;
        await supabase.from('sales').update({
          customer_id: selectedCustomerId,
          credit_status: 'unpaid',
        }).eq('id', saleId);
      }

      // Record crate deposits
      const crateDepositsData: CrateInfo[] = [];
      for (const cp of crateProductsInCart) {
        const brought = crateInfoMap[cp.productId] || 0;
        const owed = Math.max(0, cp.quantity - brought);
        const depositAmount = owed * cp.depositPerCrate;

        if (owed > 0) {
          await supabase.from('crate_deposits' as any).insert({
            store_id: storeId,
            sale_id: saleId,
            product_id: cp.productId,
            crates_required: cp.quantity,
            crates_brought: brought,
            crates_owed: owed,
            deposit_amount: depositAmount,
            status: 'pending',
          });
        }

        if (brought > 0) {
          const { data: existing } = await supabase.from('crate_tracking' as any)
            .select('*')
            .eq('store_id', storeId)
            .eq('product_id', cp.productId)
            .single();

          if (existing) {
            await supabase.from('crate_tracking' as any)
              .update({
                filled_crates: Math.max(0, (existing as any).filled_crates - cp.quantity),
                empty_crates: (existing as any).empty_crates + brought,
                updated_at: new Date().toISOString(),
              })
              .eq('id', (existing as any).id);
          }
        }

        crateDepositsData.push({
          productId: cp.productId,
          productName: cp.productName,
          cratesRequired: cp.quantity,
          cratesBrought: brought,
          depositPerCrate: cp.depositPerCrate,
        });
      }

      const sale: CompletedSale = {
        id: saleId,
        items: [...cart],
        total,
        paymentMethod: primaryMethod,
        cashier: profile?.full_name || '',
        date: new Date().toLocaleDateString('en-NG'),
        crateDeposits: crateDepositsData.length > 0 ? crateDepositsData : undefined,
        paymentSplits: isSplitPayment ? activeSplits : undefined,
      };

      setLastSale(sale);
      setShowReceipt(true);
      setShowCrateDialog(false);
      setCart([]);
      setCrateInfoMap({});
      setSelectedCustomerId(null);
      setIsSplitPayment(false);
      setPaymentSplits([{ method: 'cash', amount: 0 }, { method: 'transfer', amount: 0 }]);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['credit-sales'] });
      queryClient.invalidateQueries({ queryKey: ['crate-deposits'] });
      queryClient.invalidateQueries({ queryKey: ['crate-tracking'] });
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
          cart.map((item) => {
            const effectivePrice = getEffectivePrice(item);
            const tier = getAppliedTier(item);
            const isCrate = allProducts.find((p: any) => p.id === item.product.id)?.is_crate_product;
            return (
            <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  {isCrate && <Package className="h-3 w-3 text-warning shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground">{item.product.pack_size}</p>
                {tier && (
                  <p className="text-[10px] font-medium text-green-500">
                    Tier price: {tier.min_quantity}{tier.max_quantity ? `-${tier.max_quantity}` : '+'} @ ₦{Number(tier.price).toLocaleString()}
                  </p>
                )}
                <p className="font-mono-numbers text-sm font-semibold text-primary">
                  ₦{(effectivePrice * item.quantity).toLocaleString()}
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
                <button onClick={() => { setCart(cart.filter((i) => i.product.id !== item.product.id)); setCrateInfoMap(prev => { const n = { ...prev }; delete n[item.product.id]; return n; }); }} className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors ml-1">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            );
          })
        )}
      </div>

      <div className="border-t border-border p-4 space-y-3">
        {/* Payment mode toggle */}
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => { setIsSplitPayment(false); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              !isSplitPayment ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            Single Payment
          </button>
          <button
            onClick={() => { setIsSplitPayment(true); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
              isSplitPayment ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Split className="h-3 w-3" /> Split Payment
          </button>
        </div>

        {!isSplitPayment ? (
          /* Single payment method selector */
          <div className="grid grid-cols-4 gap-1 p-1 bg-muted rounded-lg">
            {(['cash', 'pos', 'transfer', 'credit'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => {
                  setPaymentMethod(method);
                  if (method !== 'credit') setSelectedCustomerId(null);
                }}
                className={`py-2 text-[10px] sm:text-xs font-bold uppercase rounded-md transition-all ${
                  paymentMethod === method ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        ) : (
          /* Split payment UI */
          <div className="space-y-2 bg-muted/30 rounded-lg p-3 border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Split total: ₦{total.toLocaleString()}</p>
            {paymentSplits.map((split, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={split.method}
                  onChange={(e) => updateSplitMethod(index, e.target.value as PaymentMethod)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium flex-shrink-0 w-24"
                >
                  {availableSplitMethods.map(m => (
                    <option key={m} value={m} disabled={paymentSplits.some((s, i) => i !== index && s.method === m)}>
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₦</span>
                  <input
                    type="number"
                    min="0"
                    max={total}
                    value={split.amount || ''}
                    onChange={(e) => updateSplitAmount(index, parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full h-8 rounded-md border border-input bg-background pl-6 pr-2 text-xs font-mono-numbers focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => fillRemainingToSplit(index)}
                  className="text-[10px] text-primary font-medium hover:underline whitespace-nowrap"
                  title="Fill remaining amount"
                >
                  Fill
                </button>
                {paymentSplits.length > 2 && (
                  <button
                    onClick={() => removeSplitMethod(index)}
                    className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            {paymentSplits.length < 4 && (
              <button
                onClick={addSplitMethod}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add method
              </button>
            )}
            {Math.abs(splitRemaining) > 0.01 && (
              <p className={`text-xs font-medium ${splitRemaining > 0 ? 'text-warning' : 'text-destructive'}`}>
                {splitRemaining > 0 ? `₦${splitRemaining.toLocaleString()} remaining` : `₦${Math.abs(splitRemaining).toLocaleString()} over`}
              </p>
            )}
            {Math.abs(splitRemaining) <= 0.01 && splitTotal > 0 && (
              <p className="text-xs font-medium text-green-500">✓ Fully allocated</p>
            )}
          </div>
        )}

        {/* Customer selector for credit */}
        {((!isSplitPayment && paymentMethod === 'credit') || needsCustomerForSplit) && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Select Customer</label>
            <select
              value={selectedCustomerId || ''}
              onChange={(e) => setSelectedCustomerId(e.target.value || null)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">-- Choose customer --</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}{c.phone ? ` (${c.phone})` : ''}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddCustomer(true)}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <UserPlus className="h-3 w-3" /> Add new customer
            </button>
          </div>
        )}

        {/* Crate deposit notice */}
        {crateProductsInCart.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-2.5">
            <p className="text-xs font-medium text-warning flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" /> Crate product{crateProductsInCart.length > 1 ? 's' : ''} in cart
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Deposit will be calculated at checkout based on empty crates brought</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
          <span className="font-mono-numbers text-base font-semibold text-foreground">₦{subtotal.toLocaleString()}</span>
        </div>
        {crateDepositTotal > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-warning">Crate Deposit</span>
            <span className="font-mono-numbers text-base font-semibold text-warning">₦{crateDepositTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="font-mono-numbers text-2xl font-bold text-foreground">₦{total.toLocaleString()}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { setCart([]); setCrateInfoMap({}); }} disabled={cart.length === 0} className="flex-1 py-3 rounded-lg border border-destructive text-destructive font-semibold text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            VOID
          </button>
          <button onClick={initiateCheckout} disabled={cart.length === 0 || processing} className="flex-[2] py-3 rounded-lg bg-primary text-primary-foreground font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {processing ? 'Processing...' : `CHECKOUT — ₦${total.toLocaleString()}`}
          </button>
        </div>
      </div>

      {lastSale && <ReceiptDialog sale={lastSale} open={showReceipt} onClose={() => setShowReceipt(false)} />}

      {/* Crate Dialog */}
      <Dialog open={showCrateDialog} onOpenChange={setShowCrateDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-warning" /> Crate Return Check
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Did the customer bring empty crates?</p>

          {/* Quick action: brought all crates */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allBrought: Record<string, number> = {};
                crateProductsInCart.forEach(cp => { allBrought[cp.productId] = cp.quantity; });
                setCrateInfoMap(allBrought);
              }}
              className="flex-1 py-2 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              ✓ Yes, brought all crates
            </button>
            <button
              onClick={() => {
                const noneBrought: Record<string, number> = {};
                crateProductsInCart.forEach(cp => { noneBrought[cp.productId] = 0; });
                setCrateInfoMap(noneBrought);
              }}
              className="flex-1 py-2 rounded-lg border border-destructive text-destructive text-xs font-bold hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              ✗ No crates brought
            </button>
          </div>

          <div className="space-y-3">
            {crateProductsInCart.map((cp) => {
              const brought = crateInfoMap[cp.productId] || 0;
              const owed = Math.max(0, cp.quantity - brought);
              const deposit = owed * cp.depositPerCrate;

              return (
                <div key={cp.productId} className="bg-muted/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{cp.productName}</p>
                      <p className="text-xs text-muted-foreground">Buying: {cp.quantity} crate{cp.quantity > 1 ? 's' : ''}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Deposit: ₦{cp.depositPerCrate.toLocaleString()}/crate</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Empty crates brought (or enter specific number)</label>
                    <input
                      type="number"
                      min="0"
                      max={cp.quantity}
                      value={crateInfoMap[cp.productId] ?? ''}
                      onChange={(e) => setCrateInfoMap(prev => ({
                        ...prev,
                        [cp.productId]: Math.min(parseInt(e.target.value) || 0, cp.quantity)
                      }))}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {owed > 0 && (
                    <p className="text-xs text-warning font-medium">
                      {owed} crate{owed > 1 ? 's' : ''} not returned → ₦{deposit.toLocaleString()} deposit
                    </p>
                  )}
                  {owed === 0 && (
                    <p className="text-xs text-primary font-medium">All crates accounted for — no deposit ✓</p>
                  )}
                </div>
              );
            })}

            {crateDepositTotal > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-bold text-foreground">Total Crate Deposit</span>
                <span className="font-mono-numbers text-lg font-bold text-warning">₦{crateDepositTotal.toLocaleString()}</span>
              </div>
            )}
            {crateDepositTotal === 0 && crateProductsInCart.length > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-bold text-primary">No deposit charged ✓</span>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowCrateDialog(false)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                Back
              </button>
              <button onClick={performCheckout} disabled={processing}
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40">
                {processing ? 'Processing...' : `Confirm — ₦${total.toLocaleString()}`}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Customer name" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
            <Button onClick={handleAddCustomer} disabled={!newCustomerName.trim() || addingCustomer} className="w-full">
              {addingCustomer ? 'Adding...' : 'Add Customer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
