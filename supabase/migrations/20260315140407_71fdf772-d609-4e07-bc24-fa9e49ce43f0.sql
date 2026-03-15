
-- Create inventory_outflows table
CREATE TABLE public.inventory_outflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL DEFAULT 'manual',
  removed_by UUID NOT NULL,
  removed_by_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_outflows ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Managers and owners can add outflows"
ON public.inventory_outflows FOR INSERT TO authenticated
WITH CHECK (
  (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role))
  AND (removed_by = auth.uid())
);

CREATE POLICY "Store members can view outflows"
ON public.inventory_outflows FOR SELECT TO authenticated
USING (store_id = get_user_store_id(auth.uid()));

-- Function to reduce inventory with logging
CREATE OR REPLACE FUNCTION public.reduce_inventory(
  p_store_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_removed_by UUID,
  p_removed_by_name TEXT,
  p_reason TEXT DEFAULT 'manual'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_outflow_id UUID;
BEGIN
  INSERT INTO public.inventory_outflows (store_id, product_id, quantity, removed_by, removed_by_name, reason)
  VALUES (p_store_id, p_product_id, p_quantity, p_removed_by, p_removed_by_name, p_reason)
  RETURNING id INTO v_outflow_id;

  UPDATE public.products SET stock = stock - p_quantity WHERE id = p_product_id;

  RETURN v_outflow_id;
END;
$$;
