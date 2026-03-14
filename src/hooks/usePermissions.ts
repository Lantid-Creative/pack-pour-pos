import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export type Permission =
  | 'page:dashboard' | 'page:pos' | 'page:inventory' | 'page:sales_history' | 'page:staff'
  | 'action:create_sale' | 'action:add_stock' | 'action:edit_products' | 'action:delete_products'
  | 'action:create_staff' | 'action:view_reports' | 'action:manage_roles'
  | 'data:view_revenue' | 'data:view_cost_prices' | 'data:view_inventory_value';

export const PERMISSION_LABELS: Record<Permission, { label: string; category: string }> = {
  'page:dashboard':        { label: 'View Dashboard',        category: 'Page Access' },
  'page:pos':              { label: 'View POS Terminal',      category: 'Page Access' },
  'page:inventory':        { label: 'View Inventory',        category: 'Page Access' },
  'page:sales_history':    { label: 'View Sales History',    category: 'Page Access' },
  'page:staff':            { label: 'View Staff Page',       category: 'Page Access' },
  'action:create_sale':    { label: 'Create Sales',          category: 'Actions' },
  'action:add_stock':      { label: 'Add Inventory Stock',   category: 'Actions' },
  'action:edit_products':  { label: 'Edit Products',         category: 'Actions' },
  'action:delete_products':{ label: 'Delete Products',       category: 'Actions' },
  'action:create_staff':   { label: 'Create Staff Accounts', category: 'Actions' },
  'action:view_reports':   { label: 'View Reports',          category: 'Actions' },
  'action:manage_roles':   { label: 'Manage Role Permissions', category: 'Actions' },
  'data:view_revenue':     { label: 'View Revenue Numbers',  category: 'Data Visibility' },
  'data:view_cost_prices': { label: 'View Cost Prices',      category: 'Data Visibility' },
  'data:view_inventory_value': { label: 'View Inventory Value', category: 'Data Visibility' },
};

export function usePermissions() {
  const { storeId, role } = useAuth();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['role_permissions', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('store_id', storeId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!storeId,
  });

  const hasPermission = useMemo(() => {
    return (perm: Permission): boolean => {
      // Owner always has all permissions as fallback
      if (role === 'owner') return true;
      if (!role) return false;

      const match = permissions.find(
        (p: any) => p.role === role && p.permission === perm
      );
      // If no record exists, fall back to false
      return match?.enabled ?? false;
    };
  }, [permissions, role]);

  const getPermissionsForRole = useMemo(() => {
    return (targetRole: string): Record<string, boolean> => {
      const result: Record<string, boolean> = {};
      permissions
        .filter((p: any) => p.role === targetRole)
        .forEach((p: any) => { result[p.permission] = p.enabled; });
      return result;
    };
  }, [permissions]);

  return { hasPermission, getPermissionsForRole, permissions, isLoading };
}
