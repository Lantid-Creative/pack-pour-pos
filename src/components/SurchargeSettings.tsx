import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, DollarSign, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Surcharge {
  id: string;
  store_id: string;
  label: string;
  min_amount: number;
  max_amount: number;
  charge_amount: number;
  enabled: boolean;
}

export function SurchargeSettings() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  const [masterEnabled, setMasterEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  // New rule form
  const [newLabel, setNewLabel] = useState('Other Charges');
  const [newMin, setNewMin] = useState('');
  const [newMax, setNewMax] = useState('');
  const [newCharge, setNewCharge] = useState('');

  const { data: store } = useQuery({
    queryKey: ['store-settings', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const { data, error } = await supabase.from('stores').select('*').eq('id', storeId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!storeId,
  });

  const { data: surcharges = [], isLoading } = useQuery({
    queryKey: ['surcharges', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('surcharges' as any)
        .select('*')
        .eq('store_id', storeId)
        .order('min_amount');
      if (error) throw error;
      return (data || []) as unknown as Surcharge[];
    },
    enabled: !!storeId,
  });

  useEffect(() => {
    if (store) {
      setMasterEnabled((store as any).surcharges_enabled ?? false);
    }
  }, [store]);

  const toggleMaster = async (enabled: boolean) => {
    if (!storeId) return;
    setMasterEnabled(enabled);
    const { error } = await supabase
      .from('stores')
      .update({ surcharges_enabled: enabled } as any)
      .eq('id', storeId);
    if (error) {
      toast.error(error.message);
      setMasterEnabled(!enabled);
    } else {
      toast.success(enabled ? 'Surcharges enabled' : 'Surcharges disabled');
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    }
  };

  const addRule = async () => {
    if (!storeId) return;
    const min = parseFloat(newMin);
    const max = parseFloat(newMax);
    const charge = parseFloat(newCharge);
    if (isNaN(min) || isNaN(max) || isNaN(charge) || min < 0 || max <= min || charge <= 0) {
      toast.error('Please enter valid amounts. Max must be greater than Min.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('surcharges' as any).insert({
      store_id: storeId,
      label: newLabel.trim() || 'Other Charges',
      min_amount: min,
      max_amount: max,
      charge_amount: charge,
      enabled: true,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Surcharge rule added');
      setNewMin('');
      setNewMax('');
      setNewCharge('');
      queryClient.invalidateQueries({ queryKey: ['surcharges'] });
    }
    setSaving(false);
  };

  const toggleRule = async (id: string, enabled: boolean) => {
    const { error } = await supabase
      .from('surcharges' as any)
      .update({ enabled })
      .eq('id', id);
    if (error) toast.error(error.message);
    else queryClient.invalidateQueries({ queryKey: ['surcharges'] });
  };

  const deleteRule = async (id: string) => {
    const { error } = await supabase.from('surcharges' as any).delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Rule deleted');
      queryClient.invalidateQueries({ queryKey: ['surcharges'] });
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" /> Other Charges / Surcharges
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{masterEnabled ? 'Active' : 'Off'}</span>
          <Switch checked={masterEnabled} onCheckedChange={toggleMaster} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Add automatic surcharges based on order total. When enabled, these charges are added at checkout.
      </p>

      {masterEnabled && (
        <>
          {surcharges.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Rules</p>
              {surcharges.map((s: Surcharge) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <Switch
                    checked={s.enabled}
                    onCheckedChange={(v) => toggleRule(s.id, v)}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${s.enabled ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₦{Number(s.min_amount).toLocaleString()} – ₦{Number(s.max_amount).toLocaleString()} → add ₦{Number(s.charge_amount).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteRule(s.id)}
                    className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {surcharges.length === 0 && !isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 border border-dashed border-border">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">No surcharge rules yet. Add one below.</p>
            </div>
          )}

          <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-dashed border-border">
            <p className="text-xs font-medium text-foreground">Add New Rule</p>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Label</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Delivery Fee"
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Min Total (₦)</label>
                <input
                  type="number"
                  value={newMin}
                  onChange={(e) => setNewMin(e.target.value)}
                  placeholder="1000"
                  min="0"
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm font-mono-numbers focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Max Total (₦)</label>
                <input
                  type="number"
                  value={newMax}
                  onChange={(e) => setNewMax(e.target.value)}
                  placeholder="10000"
                  min="0"
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm font-mono-numbers focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Charge (₦)</label>
                <input
                  type="number"
                  value={newCharge}
                  onChange={(e) => setNewCharge(e.target.value)}
                  placeholder="50"
                  min="0"
                  className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground text-sm font-mono-numbers focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Example: If total is between ₦{newMin || '1,000'} and ₦{newMax || '10,000'}, add ₦{newCharge || '50'} to the bill.
            </p>
            <button
              onClick={addRule}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> {saving ? 'Adding...' : 'Add Rule'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
