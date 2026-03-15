
CREATE TABLE public.product_price_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  min_quantity integer NOT NULL,
  max_quantity integer DEFAULT NULL,
  price numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_price_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view price tiers"
  ON public.product_price_tiers FOR SELECT TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Managers and owners can insert price tiers"
  ON public.product_price_tiers FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));

CREATE POLICY "Managers and owners can update price tiers"
  ON public.product_price_tiers FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));

CREATE POLICY "Managers and owners can delete price tiers"
  ON public.product_price_tiers FOR DELETE TO authenticated
  USING (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));
