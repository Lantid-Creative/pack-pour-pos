import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Plus, History, AlertTriangle, Library, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductLibraryDialog from '@/components/ProductLibraryDialog';
import { toast } from 'sonner';

export default function InventoryPage() {
  const { storeId, user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showRestock, setShowRestock] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [search, setSearch] = useState('');

  // Create product form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Soft Drink');
  const [newPackSize, setNewPackSize] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCostPrice, setNewCostPrice] = useState('');
  const [creatingProduct, setCreatingProduct] = useState(false);
  const { data: products = [] } = useQuery({
    queryKey: ['products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase.from('products').select('*').eq('store_id', storeId).order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const { data: inflows = [] } = useQuery({
    queryKey: ['inflows', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('inventory_inflows')
        .select('*, products(name)')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const handleRestock = async () => {
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0 || !user || !storeId) return;
    try {
      const { error } = await supabase.rpc('add_inventory_inflow', {
        p_store_id: storeId,
        p_product_id: selectedProduct,
        p_quantity: parseInt(quantity),
        p_added_by: user.id,
        p_added_by_name: profile?.full_name || '',
      });
      if (error) throw error;
      toast.success('Stock updated!');
      setSelectedProduct('');
      setQuantity('');
      setShowRestock(false);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inflows'] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredProducts = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage stock levels and restocking</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLibrary(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/10 active:scale-[0.98] transition-all">
            <Library className="h-4 w-4" /> Product Library
          </button>
          <button onClick={() => setShowCreateProduct(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-muted active:scale-[0.98] transition-all">
            <PlusCircle className="h-4 w-4" /> Create Product
          </button>
          <button onClick={() => setShowRestock(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
            <Plus className="h-4 w-4" /> Restock
          </button>
        </div>
      </div>

      <input type="text" placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Product</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Pack Size</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Cost Price</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Sell Price</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Margin</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Stock</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product: any) => {
              const isLow = product.stock <= product.low_stock_threshold;
              const isOut = product.stock <= 0;
              const costPrice = Number(product.cost_price || 0);
              const sellPrice = Number(product.price);
              const margin = sellPrice > 0 ? ((sellPrice - costPrice) / sellPrice * 100) : 0;
              return (
                <tr key={product.id} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                  <td className="py-3 px-4 text-muted-foreground">{product.pack_size}</td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      defaultValue={costPrice}
                      onBlur={async (e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val) || val === costPrice) return;
                        await supabase.from('products').update({ cost_price: val }).eq('id', product.id);
                        queryClient.invalidateQueries({ queryKey: ['products'] });
                        toast.success(`Cost price updated for ${product.name}`);
                      }}
                      className="w-20 text-right font-mono-numbers text-sm px-2 py-1 rounded border border-input bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers">₦{sellPrice.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-xs font-bold ${margin > 20 ? 'text-green-500' : margin > 0 ? 'text-yellow-500' : 'text-destructive'}`}>
                      {costPrice > 0 ? `${margin.toFixed(0)}%` : '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers font-bold">{product.stock}</td>
                  <td className="py-3 px-4 text-center">
                    {isOut ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">Out of Stock</span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium"><AlertTriangle className="h-3 w-3" /> Low</span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">In Stock</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {inflows.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2"><History className="h-5 w-5" /> Restock History</h3>
          <div className="space-y-2">
            {inflows.map((inflow: any) => (
              <div key={inflow.id} className="flex items-center justify-between p-2.5 rounded-md bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{(inflow.products as any)?.name || 'Product'}</p>
                  <p className="text-xs text-muted-foreground">{new Date(inflow.created_at).toLocaleDateString('en-NG')} • by {inflow.added_by_name}</p>
                </div>
                <span className="font-mono-numbers text-sm font-bold text-primary">+{inflow.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={showRestock} onOpenChange={setShowRestock}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Restock Product</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Product</label>
              <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select a product...</option>
                {products.map((p: any) => (<option key={p.id} value={p.id}>{p.name} — {p.pack_size} (Stock: {p.stock})</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Quantity (packs)</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity"
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button onClick={handleRestock} disabled={!selectedProduct || !quantity || parseInt(quantity) <= 0}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              Add Stock
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog */}
      <Dialog open={showCreateProduct} onOpenChange={setShowCreateProduct}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" /> Create New Product
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-1">
            Add a product that's not in the Product Library.
          </p>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Product Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Fanta Apple 50cl"
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {['Soft Drink', 'Beer', 'Stout', 'Malt', 'Energy', 'Water', 'Juice', 'Spirit', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Pack Size</label>
                <input
                  type="text"
                  value={newPackSize}
                  onChange={(e) => setNewPackSize(e.target.value)}
                  placeholder="e.g. Crate (24 bottles)"
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Cost Price (₦)</label>
                <input
                  type="number"
                  value={newCostPrice}
                  onChange={(e) => setNewCostPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Sell Price (₦)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button
              onClick={async () => {
                if (!newName.trim() || !newPackSize.trim() || !storeId) {
                  toast.error('Name and pack size are required');
                  return;
                }
                setCreatingProduct(true);
                const { error } = await supabase.from('products').insert({
                  store_id: storeId,
                  name: newName.trim(),
                  category: newCategory,
                  pack_size: newPackSize.trim(),
                  price: parseFloat(newPrice) || 0,
                  cost_price: parseFloat(newCostPrice) || 0,
                  stock: 0,
                  low_stock_threshold: 10,
                } as any);
                if (error) {
                  toast.error(error.message);
                } else {
                  toast.success(`${newName.trim()} added to inventory!`);
                  setNewName('');
                  setNewPackSize('');
                  setNewPrice('');
                  setNewCostPrice('');
                  setShowCreateProduct(false);
                  queryClient.invalidateQueries({ queryKey: ['products'] });
                }
                setCreatingProduct(false);
              }}
              disabled={creatingProduct || !newName.trim() || !newPackSize.trim()}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {creatingProduct ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {storeId && (
        <ProductLibraryDialog
          open={showLibrary}
          onOpenChange={setShowLibrary}
          storeId={storeId}
          existingProducts={products.map((p: any) => p.name)}
          onProductsAdded={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
        />
      )}
    </div>
  );
}
