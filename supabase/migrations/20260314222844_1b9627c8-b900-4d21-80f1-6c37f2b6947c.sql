
-- Drop and recreate the INSERT policy on stores
DROP POLICY IF EXISTS "Authenticated users can create stores" ON public.stores;

CREATE POLICY "Authenticated users can create stores"
  ON public.stores
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());
