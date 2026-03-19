import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Check, X, RefreshCw, Search, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CrateManagementPage() {
  const { storeId, user, profile, role } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'pending' | 'returned' | 'all'>('pending');
  const [returnDialog, setReturnDialog] = useState<any>(null);
  const [cratesReturned, setCratesReturned] = useState('');
  const [processing, setProcessing] = useState(false);
  const [editingCrate, setEditingCrate] = useState<any>(null);
  const [editTotal, setEditTotal] = useState('');
  const [editFilled, setEditFilled] = useState('');
  const [editEmpty, setEditEmpty] = useState('');
  const [savingCrate, setSavingCrate] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Fetch crate deposits
  const { data: deposits = [] } = useQuery({
    queryKey: ['crate-deposits', storeId, filter],
    queryFn: async () => {
      if (!storeId) return [];
      let query = supabase.from('crate_deposits' as any)
        .select('*, products(name, pack_size), sales(cashier_name, created_at)')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    },
    enabled: !!storeId,
  });

  // Fetch crate tracking (inventory overview)
  const { data: crateInventory = [] } = useQuery({
    queryKey: ['crate-tracking', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('crate_tracking' as any)
        .select('*, products(name, pack_size)')
        .eq('store_id', storeId);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!storeId,
  });
  // Fetch crate products without tracking entries (so admin can add them)
  const { data: crateProducts = [] } = useQuery({
    queryKey: ['crate-products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('products')
        .select('id, name, pack_size')
        .eq('store_id', storeId)
        .eq('is_crate_product', true);
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  // Products that have no crate_tracking entry yet
  const untracked = crateProducts.filter(
    (p) => !crateInventory.some((ct: any) => ct.product_id === p.id)
  );

  const openEditCrate = (ct: any) => {
    setEditingCrate(ct);
    setEditTotal(String(ct.total_crates));
    setEditFilled(String(ct.filled_crates));
    setEditEmpty(String(ct.empty_crates));
  };

  const handleSaveCrate = async () => {
    if (!editingCrate || !storeId) return;
    const total = parseInt(editTotal) || 0;
    const filled = parseInt(editFilled) || 0;
    const empty = parseInt(editEmpty) || 0;
    if (filled + empty > total) {
      toast.error('Filled + Empty cannot exceed Total');
      return;
    }
    setSavingCrate(true);
    try {
      if (editingCrate._isNew) {
        const { error } = await supabase.from('crate_tracking' as any).insert({
          store_id: storeId,
          product_id: editingCrate.product_id,
          total_crates: total,
          filled_crates: filled,
          empty_crates: empty,
        });
        if (error) throw error;
        toast.success('Crate inventory added');
      } else {
        const { error } = await supabase.from('crate_tracking' as any)
          .update({ total_crates: total, filled_crates: filled, empty_crates: empty, updated_at: new Date().toISOString() })
          .eq('id', editingCrate.id);
        if (error) throw error;
        toast.success('Crate inventory updated');
      }
      setEditingCrate(null);
      queryClient.invalidateQueries({ queryKey: ['crate-tracking'] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingCrate(false);
    }
  };
  const filteredDeposits = deposits.filter((d: any) => {
    if (!search) return true;
    const productName = (d.products as any)?.name || '';
    const saleId = d.sale_id || '';
    return productName.toLowerCase().includes(search.toLowerCase()) || saleId.includes(search);
  });

  const handleReturn = async () => {
    if (!returnDialog || !user || !storeId) return;
    const returned = parseInt(cratesReturned) || 0;
    if (returned <= 0 || returned > returnDialog.crates_owed) {
      toast.error(`Enter a valid number (1-${returnDialog.crates_owed})`);
      return;
    }
    setProcessing(true);
    try {
      const newOwed = returnDialog.crates_owed - returned;
      const newBrought = returnDialog.crates_brought + returned;
      const depositPerCrate = returnDialog.crates_owed > 0
        ? returnDialog.deposit_amount / returnDialog.crates_owed
        : 0;
      const refundAmount = returned * depositPerCrate;
      const newDeposit = returnDialog.deposit_amount - refundAmount;

      const updateData: any = {
        crates_brought: newBrought,
        crates_owed: newOwed,
        deposit_amount: Math.max(0, newDeposit),
      };

      if (newOwed <= 0) {
        updateData.status = 'returned';
        updateData.returned_at = new Date().toISOString();
        updateData.returned_by = user.id;
        updateData.returned_by_name = profile?.full_name || '';
      }

      const { error } = await supabase.from('crate_deposits' as any)
        .update(updateData)
        .eq('id', returnDialog.id);

      if (error) throw error;

      // Update crate tracking - add returned crates as empty
      const { data: existing } = await supabase.from('crate_tracking' as any)
        .select('*')
        .eq('store_id', storeId)
        .eq('product_id', returnDialog.product_id)
        .single();

      if (existing) {
        await supabase.from('crate_tracking' as any)
          .update({
            empty_crates: (existing as any).empty_crates + returned,
            updated_at: new Date().toISOString(),
          })
          .eq('id', (existing as any).id);
      }

      toast.success(`${returned} crate${returned > 1 ? 's' : ''} returned. ₦${refundAmount.toLocaleString()} refunded.`);
      setReturnDialog(null);
      setCratesReturned('');
      queryClient.invalidateQueries({ queryKey: ['crate-deposits'] });
      queryClient.invalidateQueries({ queryKey: ['crate-tracking'] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const isAdmin = role === 'owner' || role === 'manager';

  return (
    <div className="p-4 md:p-6 space-y-5 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Crate Management</h1>
        <p className="text-sm text-muted-foreground">Track crate deposits, returns, and inventory</p>
      </div>

      {/* Crate Inventory Overview (admin only) */}
      {isAdmin && (
        <div id="tour-crate-inventory" className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Package className="h-4 w-4" /> Crate Inventory
            </h3>
            {untracked.length > 0 && (
              <div className="relative">
                <button onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all">
                  <Plus className="h-3.5 w-3.5" /> Add Product
                </button>
                {showAddDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAddDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg shadow-lg z-20">
                      {untracked.map((p) => (
                        <button key={p.id} onClick={() => {
                          setEditingCrate({ _isNew: true, product_id: p.id, products: p });
                          setEditTotal('0'); setEditFilled('0'); setEditEmpty('0');
                          setShowAddDropdown(false);
                        }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg">
                          {p.name} <span className="text-muted-foreground text-xs">({p.pack_size})</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {crateInventory.length === 0 && untracked.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No crate products yet. Mark a product as a crate product in Inventory to get started.</p>
          )}
          {crateInventory.length === 0 && untracked.length > 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">Click "Add Product" above to set up crate inventory for your crate products.</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {crateInventory.map((ct: any) => (
              <div key={ct.id} className="rounded-lg border border-border p-3 bg-muted/20 relative group/card">
                <button onClick={() => openEditCrate(ct)}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover/card:opacity-100 transition-all">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <p className="text-sm font-semibold text-foreground">{(ct.products as any)?.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{(ct.products as any)?.pack_size}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">{ct.total_crates}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Total</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">{ct.filled_crates}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Filled</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-accent-foreground">{ct.empty_crates}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Empty</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search by product or sale ID..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          {(['pending', 'returned', 'all'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${filter === f ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits list */}
      <div id="tour-crate-deposits" className="space-y-2">
        {filteredDeposits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No crate deposits found.
          </div>
        )}
        {filteredDeposits.map((deposit: any) => {
          const product = deposit.products as any;
          const sale = deposit.sales as any;
          const isPending = deposit.status === 'pending';

          return (
            <div key={deposit.id} className={`bg-card border rounded-lg p-4 ${isPending ? 'border-warning/50' : 'border-border'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground">{product?.name || 'Product'}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isPending ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                    }`}>
                      {deposit.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sale #{deposit.sale_id.slice(-6)} • {sale?.created_at ? new Date(sale.created_at).toLocaleDateString('en-NG') : ''} • {sale?.cashier_name}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs">
                    <span className="text-muted-foreground">Required: <span className="font-bold text-foreground">{deposit.crates_required}</span></span>
                    <span className="text-muted-foreground">Brought: <span className="font-bold text-foreground">{deposit.crates_brought}</span></span>
                    <span className="text-muted-foreground">Owed: <span className="font-bold text-warning">{deposit.crates_owed}</span></span>
                    <span className="text-muted-foreground">Deposit: <span className="font-bold text-foreground">₦{Number(deposit.deposit_amount).toLocaleString()}</span></span>
                  </div>
                  {deposit.returned_at && (
                    <p className="text-xs text-primary mt-1">
                      Returned {new Date(deposit.returned_at).toLocaleDateString('en-NG')} by {deposit.returned_by_name}
                    </p>
                  )}
                </div>
                {isPending && (
                  <button
                    onClick={() => { setReturnDialog(deposit); setCratesReturned(String(deposit.crates_owed)); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 active:scale-[0.98] transition-all shrink-0"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Process Return
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Dialog */}
      <Dialog open={!!returnDialog} onOpenChange={(open) => !open && setReturnDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" /> Process Crate Return
            </DialogTitle>
          </DialogHeader>
          {returnDialog && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-3 space-y-1">
                <p className="text-sm font-semibold">{(returnDialog.products as any)?.name}</p>
                <p className="text-xs text-muted-foreground">Sale #{returnDialog.sale_id.slice(-6)}</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span>Owed: <span className="font-bold text-warning">{returnDialog.crates_owed}</span></span>
                  <span>Deposit held: <span className="font-bold">₦{Number(returnDialog.deposit_amount).toLocaleString()}</span></span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Crates Being Returned</label>
                <input type="number" min="1" max={returnDialog.crates_owed} value={cratesReturned}
                  onChange={(e) => setCratesReturned(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                {parseInt(cratesReturned) > 0 && returnDialog.crates_owed > 0 && (
                  <p className="text-xs text-primary mt-1">
                    Refund: ₦{(
                      (parseInt(cratesReturned) || 0) * (returnDialog.deposit_amount / returnDialog.crates_owed)
                    ).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setReturnDialog(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={handleReturn} disabled={processing}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40">
                  {processing ? 'Processing...' : 'Confirm Return'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Crate Inventory Dialog */}
      <Dialog open={!!editingCrate} onOpenChange={(open) => !open && setEditingCrate(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" /> {editingCrate?._isNew ? 'Set Up' : 'Edit'} Crate Inventory
            </DialogTitle>
          </DialogHeader>
          {editingCrate && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm font-semibold">{editingCrate.products?.name || (editingCrate.products as any)?.name}</p>
                <p className="text-xs text-muted-foreground">{editingCrate.products?.pack_size || (editingCrate.products as any)?.pack_size}</p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Total Crates</label>
                  <input type="number" min="0" value={editTotal} onChange={(e) => setEditTotal(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <p className="text-[11px] text-muted-foreground mt-0.5">Total number of crates you own for this product</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Filled Crates</label>
                    <input type="number" min="0" value={editFilled} onChange={(e) => setEditFilled(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <p className="text-[11px] text-muted-foreground mt-0.5">With drinks inside</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Empty Crates</label>
                    <input type="number" min="0" value={editEmpty} onChange={(e) => setEditEmpty(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <p className="text-[11px] text-muted-foreground mt-0.5">With empty bottles</p>
                  </div>
                </div>
                {(parseInt(editFilled) || 0) + (parseInt(editEmpty) || 0) > (parseInt(editTotal) || 0) && (
                  <p className="text-xs text-destructive">Filled + Empty cannot exceed Total</p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingCrate(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveCrate} disabled={savingCrate}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40">
                  {savingCrate ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
