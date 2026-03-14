import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { categories } from '@/lib/products';
import { Package, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { products, addToCart } = useAppStore();

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 p-3 overflow-x-auto border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filtered.map((product) => (
            <ProductTile key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductTile({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const isLowStock = product.stock <= product.lowStockThreshold;
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.05 }}
      onClick={() => !isOutOfStock && onAdd(product)}
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
      <span className="text-xs text-muted-foreground mt-0.5">{product.packSize}</span>
      <span className="font-mono-numbers text-sm font-bold text-primary mt-1">
        ₦{product.price.toLocaleString()}
      </span>
      <span className={`text-xs mt-0.5 ${isLowStock ? 'text-warning font-medium' : 'text-muted-foreground'}`}>
        {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
      </span>
    </motion.button>
  );
}
