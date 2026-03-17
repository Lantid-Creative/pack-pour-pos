
-- Add crate fields to products
ALTER TABLE public.products
  ADD COLUMN is_crate_product BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN crate_deposit_amount NUMERIC NOT NULL DEFAULT 0;

-- Crate inventory tracking per product
CREATE TABLE public.crate_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  total_crates INTEGER NOT NULL DEFAULT 0,
  empty_crates INTEGER NOT NULL DEFAULT 0,
  filled_crates INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (store_id, product_id)
);

ALTER TABLE public.crate_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view crate tracking"
  ON public.crate_tracking FOR SELECT TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Managers and owners can insert crate tracking"
  ON public.crate_tracking FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));

CREATE POLICY "Managers and owners can update crate tracking"
  ON public.crate_tracking FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));

-- Crate deposits per sale (tracks customer deposits for unreturned crates)
CREATE TABLE public.crate_deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  crates_required INTEGER NOT NULL DEFAULT 0,
  crates_brought INTEGER NOT NULL DEFAULT 0,
  crates_owed INTEGER NOT NULL DEFAULT 0,
  deposit_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  returned_at TIMESTAMP WITH TIME ZONE,
  returned_by UUID,
  returned_by_name TEXT
);

ALTER TABLE public.crate_deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view crate deposits"
  ON public.crate_deposits FOR SELECT TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Store members can insert crate deposits"
  ON public.crate_deposits FOR INSERT TO authenticated
  WITH CHECK (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Store members can update crate deposits"
  ON public.crate_deposits FOR UPDATE TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));
