import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PERMISSION_LABELS, Permission } from '@/hooks/usePermissions';
import { Shield, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ROLES = ['manager', 'cashier'] as const;
const CATEGORIES = ['Page Access', 'Actions', 'Data Visibility'];

export default function RolePermissionsEditor() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string>('manager');

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['role_permissions', storeId],
    queryFn: async () => {
      if (!storeId) return [];

      // Seed permissions if they don't exist yet
      const { data: existing } = await supabase
        .from('role_permissions')
        .select('id')
        .eq('store_id', storeId)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.rpc('seed_role_permissions', { p_store_id: storeId });
      }

      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('store_id', storeId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });

  const getEnabled = (role: string, perm: string): boolean => {
    const match = permissions.find((p: any) => p.role === role && p.permission === perm);
    return match?.enabled ?? false;
  };

  const togglePermission = async (role: string, perm: string) => {
    if (!storeId) return;
    const key = `${role}:${perm}`;
    setSaving(key);

    const current = getEnabled(role, perm);

    try {
      const existing = permissions.find((p: any) => p.role === role && p.permission === perm);

      if (existing) {
        const { error } = await supabase
          .from('role_permissions')
          .update({ enabled: !current })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('role_permissions')
          .insert({ store_id: storeId, role: role as any, permission: perm, enabled: !current });
        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['role_permissions'] });
      toast.success(`Permission ${!current ? 'enabled' : 'disabled'}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update permission');
    } finally {
      setSaving(null);
    }
  };

  const allPermissions = Object.entries(PERMISSION_LABELS) as [Permission, { label: string; category: string }][];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
        Loading permissions...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Role Permissions</h2>
      </div>

      {/* Role selector tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        {ROLES.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRole(r)}
            className={`px-4 py-2 rounded-md text-sm font-semibold capitalize transition-all ${
              activeRole === r
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Permission categories */}
      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const categoryPerms = allPermissions.filter(([, info]) => info.category === category);

          return (
            <div key={category} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-muted/30 border-b border-border">
                <h3 className="text-sm font-bold text-foreground">{category}</h3>
              </div>
              <div className="divide-y divide-border/50">
                {categoryPerms.map(([perm, info]) => {
                  const enabled = getEnabled(activeRole, perm);
                  const isSaving = saving === `${activeRole}:${perm}`;
                  // Owner permissions are not editable (always enabled)
                  const isOwnerOnly = perm === 'action:manage_roles' || perm === 'page:staff';

                  return (
                    <div key={perm} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{info.label}</p>
                        <p className="text-xs text-muted-foreground">{perm}</p>
                      </div>
                      <button
                        onClick={() => togglePermission(activeRole, perm)}
                        disabled={!!saving}
                        className={`relative h-7 w-12 rounded-full transition-colors ${
                          enabled
                            ? 'bg-primary'
                            : 'bg-muted'
                        } ${saving ? 'opacity-50' : ''}`}
                      >
                        {isSaving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground" />
                        ) : (
                          <div
                            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                              enabled ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Note: Owner permissions cannot be modified — owners always have full access.
      </p>
    </div>
  );
}
