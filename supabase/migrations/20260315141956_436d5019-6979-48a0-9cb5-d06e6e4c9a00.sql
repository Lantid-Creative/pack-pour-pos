
-- Allow owners to update roles in their store
CREATE POLICY "Owners can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (has_role(auth.uid(), store_id, 'owner'::app_role))
WITH CHECK (has_role(auth.uid(), store_id, 'owner'::app_role));
