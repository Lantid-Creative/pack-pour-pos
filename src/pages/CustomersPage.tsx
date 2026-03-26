import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Search, Phone, Mail, Edit2, Trash2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CustomersPage() {
  const { storeId, role } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState<any>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('store_id', storeId)
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  // Fetch credit sales per customer
  const { data: creditStats = {} } = useQuery({
    queryKey: ['customer-credit-stats', storeId],
    queryFn: async () => {
      if (!storeId) return {};
      const { data, error } = await supabase
        .from('sales')
        .select('customer_id, total, credit_status')
        .eq('store_id', storeId)
        .eq('payment_method', 'credit')
        .not('customer_id', 'is', null);
      if (error) throw error;
      const stats: Record<string, { total: number; unpaid: number }> = {};
      (data || []).forEach((s: any) => {
        if (!stats[s.customer_id]) stats[s.customer_id] = { total: 0, unpaid: 0 };
        stats[s.customer_id].total += Number(s.total);
        if (s.credit_status !== 'paid') stats[s.customer_id].unpaid += Number(s.total);
      });
      return stats;
    },
    enabled: !!storeId,
  });

  const filtered = customers.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  const openAdd = () => {
    setForm({ name: '', phone: '', email: '', notes: '' });
    setEditCustomer(null);
    setShowAdd(true);
  };

  const openEdit = (c: any) => {
    setForm({ name: c.name, phone: c.phone || '', email: c.email || '', notes: c.notes || '' });
    setEditCustomer(c);
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !storeId) return;
    setSaving(true);
    try {
      if (editCustomer) {
        const { error } = await supabase.from('customers').update({
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          notes: form.notes.trim() || null,
        }).eq('id', editCustomer.id);
        if (error) throw error;
        toast.success('Customer updated');
      } else {
        const { error } = await supabase.from('customers').insert({
          store_id: storeId,
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          notes: form.notes.trim() || null,
        });
        if (error) throw error;
        toast.success('Customer added');
      }
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setShowAdd(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this customer?')) return;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Customer deleted');
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  };

  return (
    <div className="p-4 md:p-6 space-y-5 md:space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">{customers.length} customer{customers.length !== 1 ? 's' : ''} registered</p>
        </div>
        <Button onClick={openAdd} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c: any) => {
          const stats = (creditStats as any)[c.id];
          return (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{c.name}</h3>
                  {c.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</p>}
                  {c.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</p>}
                </div>
                <div className="flex gap-1">
                  {(role === 'owner' || role === 'manager') && (
                    <button onClick={() => openEdit(c)} className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:bg-muted"><Edit2 className="h-3.5 w-3.5" /></button>
                  )}
                  {role === 'owner' && (
                    <button onClick={() => handleDelete(c.id)} className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>
              {stats && (
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total credit: ₦{stats.total.toLocaleString()}</span>
                  {stats.unpaid > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">₦{stats.unpaid.toLocaleString()} unpaid</Badge>
                  )}
                </div>
              )}
              {c.notes && <p className="text-xs text-muted-foreground italic">{c.notes}</p>}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p>No customers found</p>
          </div>
        )}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Customer name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button onClick={handleSave} disabled={!form.name.trim() || saving} className="w-full">
              {saving ? 'Saving...' : editCustomer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
