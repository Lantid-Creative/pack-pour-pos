
-- Allow store members to view profiles of other members in the same store
CREATE POLICY "Store members can view store profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  store_id IS NOT NULL AND store_id = get_user_store_id(auth.uid())
);
