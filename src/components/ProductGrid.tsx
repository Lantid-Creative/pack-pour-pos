import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Package, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories } from '@/lib/products';

interface ProductRow {
  id: string;
  name: string;
  category: string;
  pack_size: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
}

export function ProductGrid({ onAdd }: { onAdd: (product: ProductRow) => void }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { storeId } = useAuth();

  const { data: products = [] } = useQuery({
    queryKey: ['products', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('category')
        .order('name');
      if (error) throw error;
      return data as ProductRow[];
    },
    enabled: !!storeId,
  });

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

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getProductTiers = (productId: string) => allTiers.filter((t: any) => t.product_id === productId);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filtered.map((product) => (
            <ProductTile key={product.id} product={product} tiers={getProductTiers(product.id)} onAdd={() => onAdd(product)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductTile({ product, tiers, onAdd }: { product: ProductRow; tiers: any[]; onAdd: () => void }) {
  const isLowStock = product.stock <= product.low_stock_threshold;
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.05 }}
      onClick={() => !isOutOfStock && onAdd()}
      disabled={isOutOfStock}
      className={`relative flex flex-col items-center p-3 rounded-lg border border-border bg-card text-card-foreground transition-colors ${
        isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5 active:bg-primary/10 cursor-pointer'
      }`}
    >
      {isLowStock && !isOutOfStock && (
        <div className="absolute top-1.5 right-1.5">
          <AlertTriangle className="h-4 w-4 text-warning" />
        </div>
      )}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
        <Package className="h-5 w-5 text-primary" />
      </div>
      <span className="text-sm font-semibold text-center leading-tight">{product.name}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{product.pack_size}</span>
      <span className="font-mono-numbers text-sm font-bold text-primary mt-1">
        ₦{product.price.toLocaleString()}
      </span>
      {tiers.length > 0 && (
        <div className="flex flex-col items-center gap-0.5 mt-0.5">
          {tiers.slice(0, 2).map((t: any) => (
            <span key={t.id} className="text-[10px] text-green-500 font-medium">
              ₦{Number(t.price).toLocaleString()} for {t.min_quantity}{t.max_quantity ? `-${t.max_quantity}` : '+'}
            </span>
          ))}
          {tiers.length > 2 && (
            <span className="text-[10px] text-muted-foreground">+{tiers.length - 2} more tiers</span>
          )}
        </div>
      )}
      <span className={`text-xs mt-0.5 ${isLowStock ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
        {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
      </span>
    </motion.button>
  );
}
