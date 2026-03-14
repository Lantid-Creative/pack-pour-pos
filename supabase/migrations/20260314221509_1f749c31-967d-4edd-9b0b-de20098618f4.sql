
-- Create role_permissions table to store configurable permissions per role per store
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  permission TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(store_id, role, permission)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Owners can manage permissions
CREATE POLICY "Owners can manage role permissions"
ON public.role_permissions FOR ALL TO authenticated
USING (has_role(auth.uid(), store_id, 'owner'::app_role))
WITH CHECK (has_role(auth.uid(), store_id, 'owner'::app_role));

-- All store members can read permissions (needed for enforcement)
CREATE POLICY "Store members can view permissions"
ON public.role_permissions FOR SELECT TO authenticated
USING (store_id = get_user_store_id(auth.uid()));

-- Create function to seed default permissions for a store
CREATE OR REPLACE FUNCTION public.seed_role_permissions(p_store_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_permissions TEXT[] := ARRAY[
    'page:dashboard', 'page:pos', 'page:inventory', 'page:sales_history', 'page:staff',
    'action:create_sale', 'action:add_stock', 'action:edit_products', 'action:delete_products',
    'action:create_staff', 'action:view_reports', 'action:manage_roles',
    'data:view_revenue', 'data:view_cost_prices', 'data:view_inventory_value'
  ];
  v_perm TEXT;
  v_role app_role;
  v_enabled BOOLEAN;
BEGIN
  FOREACH v_perm IN ARRAY v_permissions LOOP
    FOREACH v_role IN ARRAY ARRAY['owner'::app_role, 'manager'::app_role, 'cashier'::app_role] LOOP
      -- Determine default enabled state
      v_enabled := CASE
        -- Owner gets everything
        WHEN v_role = 'owner' THEN true
        -- Manager defaults
        WHEN v_role = 'manager' AND v_perm IN (
          'page:dashboard', 'page:pos', 'page:inventory', 'page:sales_history',
          'action:create_sale', 'action:add_stock', 'action:edit_products', 'action:view_reports',
          'data:view_revenue', 'data:view_inventory_value'
        ) THEN true
        -- Cashier defaults
        WHEN v_role = 'cashier' AND v_perm IN (
          'page:dashboard', 'page:pos', 'page:sales_history',
          'action:create_sale'
        ) THEN true
        ELSE false
      END;

      INSERT INTO public.role_permissions (store_id, role, permission, enabled)
      VALUES (p_store_id, v_role, v_perm, v_enabled)
      ON CONFLICT (store_id, role, permission) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;
