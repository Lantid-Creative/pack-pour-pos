import { useState, useMemo } from 'react';
import { productLibrary, libraryCategories, LibraryProduct } from '@/lib/productLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Check, Library, Package, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: string;
  existingProducts: string[];
  onProductsAdded: () => void;
}

interface SelectedProduct {
  idx: number;
  stock: string;
  price: string;
  costPrice: string;
}

export default function ProductLibraryDialog({
  open, onOpenChange, storeId, existingProducts, onProductsAdded
}: ProductLibraryDialogProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Map<number, SelectedProduct>>(new Map());
  const [adding, setAdding] = useState(false);

  // Custom product form
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Soft Drink');
  const [customPackSize, setCustomPackSize] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customCostPrice, setCustomCostPrice] = useState('');
  const [customStock, setCustomStock] = useState('');

  const existingSet = useMemo(() => new Set(existingProducts.map(n => n.toLowerCase())), [existingProducts]);

  const filtered = useMemo(() => {
    return productLibrary.filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const toggle = (idx: number) => {
    setSelected(prev => {
      const next = new Map(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx, { idx, stock: '', price: '', costPrice: '' });
      return next;
    });
  };

  const updateSelected = (idx: number, field: 'stock' | 'price' | 'costPrice', value: string) => {
    setSelected(prev => {
      const next = new Map(prev);
      const item = next.get(idx);
      if (item) next.set(idx, { ...item, [field]: value });
      return next;
    });
  };

  const handleAdd = async () => {
    if (selected.size === 0) return;
    setAdding(true);

    const products = Array.from(selected.values()).map(sel => {
      const p = productLibrary[sel.idx];
      return {
        store_id: storeId,
        name: p.name,
        category: p.category,
        pack_size: p.packSize,
        price: parseFloat(sel.price) || 0,
        cost_price: parseFloat(sel.costPrice) || 0,
        stock: parseInt(sel.stock) || 0,
        low_stock_threshold: 10,
      };
    });

    const { error } = await supabase.from('products').insert(products as any);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${products.length} product${products.length > 1 ? 's' : ''} added to inventory!`);
      setSelected(new Map());
      onProductsAdded();
      onOpenChange(false);
    }
    setAdding(false);
  };

  const handleAddCustom = async () => {
    if (!customName.trim() || !customPackSize.trim()) {
      toast.error('Name and pack size are required');
      return;
    }
    setAdding(true);
    const { error } = await supabase.from('products').insert({
      store_id: storeId,
      name: customName.trim(),
      category: customCategory,
      pack_size: customPackSize.trim(),
      price: parseFloat(customPrice) || 0,
      cost_price: parseFloat(customCostPrice) || 0,
      stock: parseInt(customStock) || 0,
      low_stock_threshold: 10,
    } as any);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${customName.trim()} added to inventory!`);
      setCustomName(''); setCustomPackSize(''); setCustomPrice(''); setCustomCostPrice(''); setCustomStock('');
      setShowCustom(false);
      onProductsAdded();
      onOpenChange(false);
    }
    setAdding(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-primary" /> Product Library
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground -mt-1">
          Select products, set prices & stock, then add to inventory.
        </p>

        {/* Search + Categories */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by brand or product name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {libraryCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
            {filtered.map((p) => {
              const realIdx = productLibrary.indexOf(p);
              const isSelected = selected.has(realIdx);
              const alreadyExists = existingSet.has(p.name.toLowerCase());
              const sel = selected.get(realIdx);

              return (
                <div
                  key={`${p.name}-${p.packSize}`}
                  className={`rounded-lg border text-left transition-all ${
                    alreadyExists
                      ? 'border-border/50 bg-muted/30 opacity-50'
                      : isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-primary/40 hover:bg-muted/20'
                  }`}
                >
                  <button
                    onClick={() => !alreadyExists && toggle(realIdx)}
                    disabled={alreadyExists}
                    className="flex items-start gap-3 p-3 w-full text-left"
                  >
                    <div className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-primary border-primary'
                        : alreadyExists
                          ? 'bg-muted border-border'
                          : 'border-input'
                    }`}>
                      {(isSelected || alreadyExists) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.packSize}</p>
                      {alreadyExists && <p className="text-xs text-muted-foreground italic">Already in inventory</p>}
                    </div>
                  </button>
                  {/* Inline price/stock fields when selected */}
                  {isSelected && sel && (
                    <div className="px-3 pb-3 grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-muted-foreground block">Cost (₦)</label>
                        <input type="number" min="0" value={sel.costPrice} onChange={e => updateSelected(realIdx, 'costPrice', e.target.value)}
                          placeholder="0" className="w-full px-2 py-1.5 rounded border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block">Sell (₦)</label>
                        <input type="number" min="0" value={sel.price} onChange={e => updateSelected(realIdx, 'price', e.target.value)}
                          placeholder="0" className="w-full px-2 py-1.5 rounded border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground block">Stock</label>
                        <input type="number" min="0" value={sel.stock} onChange={e => updateSelected(realIdx, 'stock', e.target.value)}
                          placeholder="0" className="w-full px-2 py-1.5 rounded border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No products match your search. Try adding a custom product below.
            </div>
          )}
        </div>

        {/* Custom Product */}
        {showCustom ? (
          <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border">
            <p className="text-sm font-semibold text-foreground">Add Custom Product</p>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Product name" value={customName} onChange={e => setCustomName(e.target.value)}
                className="col-span-2 px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <select value={customCategory} onChange={e => setCustomCategory(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                {libraryCategories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input placeholder="Pack size" value={customPackSize} onChange={e => setCustomPackSize(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="number" placeholder="Cost price (₦)" value={customCostPrice} onChange={e => setCustomCostPrice(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="number" placeholder="Sell price (₦)" value={customPrice} onChange={e => setCustomPrice(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="number" placeholder="Initial stock" value={customStock} onChange={e => setCustomStock(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <button onClick={handleAddCustom} disabled={adding}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40">
                {adding ? 'Adding...' : 'Add Custom'}
              </button>
            </div>
            <button onClick={() => setShowCustom(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowCustom(true)} className="text-sm text-primary hover:underline flex items-center gap-1">
            <Package className="h-3.5 w-3.5" /> Can't find a product? Add custom
          </button>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {selected.size > 0 ? `${selected.size} product${selected.size > 1 ? 's' : ''} selected` : 'Select products to add'}
          </p>
          <button
            onClick={handleAdd}
            disabled={selected.size === 0 || adding}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {adding ? 'Adding...' : `Add ${selected.size || ''} to Inventory`}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
