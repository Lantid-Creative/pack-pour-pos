import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { defaultProducts } from '@/lib/products';
import { Package, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function StoreSetupPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !storeName.trim()) return;
    setSubmitting(true);

    try {
      // Create store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({ name: storeName.trim(), address: address.trim() || null, owner_id: user.id })
        .select()
        .single();

      if (storeError) throw storeError;

      // Assign owner role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, store_id: store.id, role: 'owner' as const });

      if (roleError) throw roleError;

      // Update profile with store_id
      await supabase
        .from('profiles')
        .update({ store_id: store.id })
        .eq('user_id', user.id);

      // Seed default products
      const productInserts = defaultProducts.map((p) => ({
        store_id: store.id,
        name: p.name,
        category: p.category,
        pack_size: p.packSize,
        price: p.price,
        stock: p.stock,
        low_stock_threshold: p.lowStockThreshold,
      }));

      await supabase.from('products').insert(productInserts);

      toast.success('Store created successfully!');
      // Force a page reload to re-fetch auth data
      window.location.href = '/dashboard';
    } catch (err: any) {
      toast.error(err.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-landing-bg flex items-center justify-center p-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-landing-purple/15 rounded-full blur-[120px] pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-landing-purple mb-3">
            <Store className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set Up Your Store</h1>
          <p className="text-sm text-landing-muted">
            Welcome, {profile?.full_name}! Let's create your wholesale drink store.
          </p>
        </div>

        <div className="bg-landing-card rounded-xl border border-landing-border p-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-1 block">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. ChiefDrinks Wholesale"
                required
                className="w-full px-3 py-2 rounded-md border border-landing-border bg-landing-bg text-white placeholder:text-landing-muted focus:outline-none focus:ring-2 focus:ring-landing-purple"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-1 block">Address (optional)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Store location"
                className="w-full px-3 py-2 rounded-md border border-landing-border bg-landing-bg text-white placeholder:text-landing-muted focus:outline-none focus:ring-2 focus:ring-landing-purple"
              />
            </div>
            <p className="text-xs text-landing-muted">
              We'll populate your store with 30+ Nigerian drink products to get you started. You can customize later.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-landing-purple text-white font-bold text-sm hover:bg-landing-purple-hover active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {submitting ? 'Creating Store...' : 'Create Store'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
