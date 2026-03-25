
CREATE TABLE public.surcharges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Other Charges',
  min_amount NUMERIC NOT NULL DEFAULT 0,
  max_amount NUMERIC NOT NULL DEFAULT 0,
  charge_amount NUMERIC NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.surcharges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view surcharges"
  ON public.surcharges FOR SELECT TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Owners can manage surcharges"
  ON public.surcharges FOR ALL TO authenticated
  USING (has_role(auth.uid(), store_id, 'owner'::app_role))
  WITH CHECK (has_role(auth.uid(), store_id, 'owner'::app_role));

-- Master toggle on stores table
ALTER TABLE public.stores ADD COLUMN surcharges_enabled BOOLEAN NOT NULL DEFAULT false;
