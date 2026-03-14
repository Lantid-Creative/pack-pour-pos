-- 1) Allow store owner to read their store immediately after insert (before user_roles exists)
DROP POLICY IF EXISTS "Store members can view their store" ON public.stores;

CREATE POLICY "Store members can view their store"
ON public.stores
FOR SELECT
TO authenticated
USING (
  id = public.get_user_store_id(auth.uid())
  OR owner_id = auth.uid()
);

-- 2) Allow bootstrap owner role insertion only for the authenticated owner of that store
DROP POLICY IF EXISTS "Owners can manage roles" ON public.user_roles;

CREATE POLICY "Owners can manage roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), store_id, 'owner'::app_role)
  OR (
    role = 'owner'::app_role
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.stores s
      WHERE s.id = user_roles.store_id
        AND s.owner_id = auth.uid()
    )
  )
);