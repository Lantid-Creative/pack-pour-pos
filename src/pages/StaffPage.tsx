import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Users, Trash2, Shield, Settings, Lock, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import RolePermissionsEditor from '@/components/RolePermissionsEditor';

type AppRole = 'cashier' | 'manager';

export default function StaffPage() {
  const { storeId, profile, user } = useAuth();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'staff' | 'permissions'>('staff');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AppRole>('cashier');
  const [submitting, setSubmitting] = useState(false);

  // Edit staff state
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<AppRole>('cashier');
  const [saving, setSaving] = useState(false);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('id, user_id, role')
        .eq('store_id', storeId);
      if (error) throw error;
      if (!roles || roles.length === 0) return [];

      const userIds = roles.map((r: any) => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));

      return roles.map((r: any) => ({
        ...r,
        full_name: profileMap.get(r.user_id) || 'Unknown',
      }));
    },
    enabled: !!storeId,
  });

  // Check current subscription plan
  const { data: subscription } = useQuery({
    queryKey: ['subscription-plan', storeId],
    queryFn: async () => {
      if (!storeId) return null;
      const { data } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('store_id', storeId)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!storeId,
  });

  // During trial (no subscription), allow staff creation. Only block on active starter plan.
  const isStarterPlan = !profile?.lifetime_access && subscription?.plan === 'starter';

  const handleAddStaff = async () => {
    if (!email || !fullName || !storeId) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-staff', {
        body: { email, full_name: fullName, role, store_id: storeId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(data?.message || 'Staff created!');
      setShowAdd(false);
      setEmail('');
      setFullName('');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create staff');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveStaff = async (staffMember: any) => {
    const confirmed = window.confirm(`Remove "${staffMember.full_name}" from your store?`);
    if (!confirmed) return;
    try {
      const { error } = await supabase.from('user_roles').delete().eq('id', staffMember.id);
      if (error) throw error;
      toast.success('Staff removed');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openEditDialog = (staffMember: any) => {
    setEditingStaff(staffMember);
    setEditName(staffMember.full_name);
    setEditRole(staffMember.role as AppRole);
  };

  const handleSaveEdit = async () => {
    if (!editingStaff || !storeId) return;
    setSaving(true);
    try {
      // Update profile name (owner can update staff profiles via edge function)
      const { error: fnError, data } = await supabase.functions.invoke('create-staff', {
        body: {
          action: 'update',
          user_id: editingStaff.user_id,
          full_name: editName.trim(),
          role: editRole,
          store_id: storeId,
          role_id: editingStaff.id,
        },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      toast.success('Staff updated!');
      setEditingStaff(null);
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update staff');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeClass = (r: string) => {
    switch (r) {
      case 'owner': return 'bg-primary/10 text-primary';
      case 'manager': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted-foreground">Manage staff accounts and role permissions</p>
        </div>
        {isStarterPlan ? (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium cursor-not-allowed">
            <Lock className="h-4 w-4" /> Upgrade to Add Staff
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <UserPlus className="h-4 w-4" /> Add Staff
          </button>
        )}
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted w-fit">
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'staff'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" /> Staff List
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'permissions'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="h-4 w-4" /> Permissions
        </button>
      </div>

      {activeTab === 'permissions' ? (
        <RolePermissionsEditor />
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading staff...</div>
          ) : staff.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No staff members yet.</div>
          ) : (
            <>
              {/* Mobile card view */}
              <div className="block md:hidden divide-y divide-border">
                {staff.map((s: any) => (
                  <div key={s.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{s.full_name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getRoleBadgeClass(s.role)}`}>
                          {s.role}
                        </span>
                      </div>
                    </div>
                    {s.role !== 'owner' && (
                      <div className="flex items-center gap-1 ml-2">
                        <button onClick={() => openEditDialog(s)} className="h-8 w-8 rounded inline-flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleRemoveStaff(s)} className="h-8 w-8 rounded inline-flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Desktop table view */}
              <table className="w-full text-sm hidden md:table">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Role</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s: any) => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{s.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getRoleBadgeClass(s.role)}`}>
                          {s.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {s.role !== 'owner' && (
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => openEditDialog(s)} title="Edit staff" className="h-8 w-8 rounded inline-flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleRemoveStaff(s)} title="Remove staff" className="h-8 w-8 rounded inline-flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {/* Add Staff Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" /> Add Staff Member
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Staff member name"
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(['cashier', 'manager'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-md text-sm font-semibold capitalize transition-all ${
                      role === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddStaff}
              disabled={submitting || !email || !fullName}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {submitting ? 'Creating...' : 'Create Staff Account'}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Staff will use temporary password: <code className="font-mono-numbers bg-muted px-1 rounded">TempPass123!</code>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" /> Edit Staff Member
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(['cashier', 'manager'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setEditRole(r)}
                    className={`py-2 rounded-md text-sm font-semibold capitalize transition-all ${
                      editRole === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSaveEdit}
              disabled={saving || !editName.trim()}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
