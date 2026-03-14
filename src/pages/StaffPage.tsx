import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Users, Trash2, Shield, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import RolePermissionsEditor from '@/components/RolePermissionsEditor';

type AppRole = 'cashier' | 'manager';

export default function StaffPage() {
  const { storeId } = useAuth();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'staff' | 'permissions'>('staff');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AppRole>('cashier');
  const [submitting, setSubmitting] = useState(false);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('user_roles')
        .select('id, user_id, role, profiles:user_id(full_name, user_id)')
        .eq('store_id', storeId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });

  const handleAddStaff = async () => {
    if (!email || !fullName || !storeId) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-staff', {
        body: { email, full_name: fullName, role, store_id: storeId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Staff created! Temporary password: TempPass123!`);
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

  const handleRemoveStaff = async (roleId: string) => {
    try {
      const { error } = await supabase.from('user_roles').delete().eq('id', roleId);
      if (error) throw error;
      toast.success('Staff removed');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    } catch (err: any) {
      toast.error(err.message);
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
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-sm text-muted-foreground">Manage staff accounts and role permissions</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <UserPlus className="h-4 w-4" /> Add Staff
        </button>
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
        <>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading staff...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Role</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s: any) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{(s.profiles as any)?.full_name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getRoleBadgeClass(s.role)}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {s.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveStaff(s.id)}
                        className="h-8 w-8 rounded inline-flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
        </>
      )}
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
    </div>
  );
}
