import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreditSalesPage() {
  const { storeId, user, profile, role } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'paid'>('unpaid');
  const [payDialog, setPayDialog] = useState<any>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('cash');
  const [payNotes, setPayNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [expandedSale, setExpandedSale] = useState<string | null>(null);

  const { data: creditSales = [] } = useQuery({
    queryKey: ['credit-sales', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*), customers(name, phone)')
        .eq('store_id', storeId)
        .eq('payment_method', 'credit')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const { data: allPayments = [] } = useQuery({
    queryKey: ['credit-payments', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('credit_payments')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const getPaymentsForSale = (saleId: string) => allPayments.filter((p: any) => p.sale_id === saleId);
  const getTotalPaid = (saleId: string) => getPaymentsForSale(saleId).reduce((s: number, p: any) => s + Number(p.amount), 0);

  const filtered = creditSales.filter((s: any) => {
    if (filter === 'unpaid') return s.credit_status !== 'paid';
    if (filter === 'paid') return s.credit_status === 'paid';
    return true;
  });

  const totalUnpaid = creditSales
    .filter((s: any) => s.credit_status !== 'paid')
    .reduce((sum: number, s: any) => sum + (Number(s.total) - getTotalPaid(s.id)), 0);

  const handleRecordPayment = async () => {
    if (!payDialog || !user || !storeId || !payAmount) return;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) { toast.error('Enter a valid amount'); return; }
    
    const remaining = Number(payDialog.total) - getTotalPaid(payDialog.id);
    if (amount > remaining) { toast.error(`Max payable is ₦${remaining.toLocaleString()}`); return; }

    setProcessing(true);
    try {
      const { error } = await supabase.from('credit_payments').insert({
        sale_id: payDialog.id,
        store_id: storeId,
        amount,
        payment_method: payMethod,
        recorded_by: user.id,
        recorded_by_name: profile?.full_name || '',
        notes: payNotes.trim() || null,
      });
      if (error) throw error;

      // If fully paid, update credit_status
      const newTotalPaid = getTotalPaid(payDialog.id) + amount;
      if (newTotalPaid >= Number(payDialog.total)) {
        await supabase.from('sales').update({ credit_status: 'paid' }).eq('id', payDialog.id);
      } else {
        await supabase.from('sales').update({ credit_status: 'partial' }).eq('id', payDialog.id);
      }

      toast.success('Payment recorded');
      queryClient.invalidateQueries({ queryKey: ['credit-sales'] });
      queryClient.invalidateQueries({ queryKey: ['credit-payments'] });
      queryClient.invalidateQueries({ queryKey: ['customer-credit-stats'] });
      setPayDialog(null);
      setPayAmount('');
      setPayNotes('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkPaid = async (sale: any) => {
    if (!confirm('Mark this sale as fully paid?')) return;
    const remaining = Number(sale.total) - getTotalPaid(sale.id);
    try {
      if (remaining > 0) {
        await supabase.from('credit_payments').insert({
          sale_id: sale.id,
          store_id: storeId!,
          amount: remaining,
          payment_method: 'cash',
          recorded_by: user!.id,
          recorded_by_name: profile?.full_name || '',
          notes: 'Marked as fully paid',
        });
      }
      await supabase.from('sales').update({ credit_status: 'paid' }).eq('id', sale.id);
      toast.success('Marked as paid');
      queryClient.invalidateQueries({ queryKey: ['credit-sales'] });
      queryClient.invalidateQueries({ queryKey: ['credit-payments'] });
      queryClient.invalidateQueries({ queryKey: ['customer-credit-stats'] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const isAdmin = role === 'owner' || role === 'manager';

  return (
    <div className="p-4 md:p-6 space-y-5 md:space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Credit Sales</h1>
          <p className="text-sm text-muted-foreground">Manage outstanding credit and payment history</p>
        </div>
        {totalUnpaid > 0 && (
          <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold">
            Outstanding: ₦{totalUnpaid.toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted w-fit">
        {(['unpaid', 'all', 'paid'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
              filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No {filter} credit sales</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sale: any) => {
            const paid = getTotalPaid(sale.id);
            const remaining = Number(sale.total) - paid;
            const payments = getPaymentsForSale(sale.id);
            const expanded = expandedSale === sale.id;
            const customerName = sale.customers?.name || 'Unknown Customer';

            return (
              <div key={sale.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{customerName}</h3>
                      {sale.credit_status === 'paid' ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-200 text-[10px]">Paid</Badge>
                      ) : sale.credit_status === 'partial' ? (
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 text-[10px]">Partial</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">Unpaid</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      #{sale.id.slice(-6)} • {new Date(sale.created_at).toLocaleDateString('en-NG')} • Cashier: {sale.cashier_name}
                    </p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {(sale.sale_items || []).map((item: any, i: number) => (
                        <span key={i}>{i > 0 && ', '}{item.quantity}x {item.product_name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-foreground font-mono-numbers">₦{Number(sale.total).toLocaleString()}</p>
                    {paid > 0 && <p className="text-xs text-green-600">Paid: ₦{paid.toLocaleString()}</p>}
                    {remaining > 0 && <p className="text-xs text-destructive font-semibold">Owing: ₦{remaining.toLocaleString()}</p>}
                  </div>
                </div>

                {isAdmin && sale.credit_status !== 'paid' && (
                  <div className="px-4 pb-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      setPayDialog(sale);
                      setPayAmount(remaining.toString());
                    }} className="text-xs gap-1">
                      <CreditCard className="h-3 w-3" /> Record Payment
                    </Button>
                    <Button size="sm" variant="default" onClick={() => handleMarkPaid(sale)} className="text-xs gap-1">
                      <CheckCircle className="h-3 w-3" /> Mark Fully Paid
                    </Button>
                  </div>
                )}

                {payments.length > 0 && (
                  <div className="border-t border-border">
                    <button onClick={() => setExpandedSale(expanded ? null : sale.id)}
                      className="w-full px-4 py-2 flex items-center justify-between text-xs text-muted-foreground hover:bg-muted/30">
                      <span>{payments.length} payment{payments.length !== 1 ? 's' : ''} recorded</span>
                      {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                    {expanded && (
                      <div className="px-4 pb-3 space-y-2">
                        {payments.map((p: any) => (
                          <div key={p.id} className="flex items-center justify-between text-xs bg-muted/30 rounded-md px-3 py-2">
                            <div>
                              <span className="font-medium text-foreground">₦{Number(p.amount).toLocaleString()}</span>
                              <span className="text-muted-foreground ml-2 uppercase">{p.payment_method}</span>
                              {p.notes && <span className="text-muted-foreground ml-2">— {p.notes}</span>}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(p.created_at).toLocaleDateString('en-NG')} by {p.recorded_by_name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!payDialog} onOpenChange={(o) => !o && setPayDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          {payDialog && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Customer: <strong>{payDialog.customers?.name}</strong> — Remaining: <strong>₦{(Number(payDialog.total) - getTotalPaid(payDialog.id)).toLocaleString()}</strong>
              </p>
              <Input type="number" placeholder="Amount" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
              <Select value={payMethod} onValueChange={setPayMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Notes (optional)" value={payNotes} onChange={(e) => setPayNotes(e.target.value)} />
              <Button onClick={handleRecordPayment} disabled={processing} className="w-full">
                {processing ? 'Recording...' : 'Record Payment'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
