
-- Add reason column to inventory_inflows
ALTER TABLE public.inventory_inflows ADD COLUMN reason TEXT NOT NULL DEFAULT 'restock';

-- Update add_inventory_inflow to accept reason
CREATE OR REPLACE FUNCTION public.add_inventory_inflow(
  p_store_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_added_by UUID,
  p_added_by_name TEXT,
  p_reason TEXT DEFAULT 'restock'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_inflow_id UUID;
BEGIN
  INSERT INTO public.inventory_inflows (store_id, product_id, quantity, added_by, added_by_name, reason)
  VALUES (p_store_id, p_product_id, p_quantity, p_added_by, p_added_by_name, p_reason)
  RETURNING id INTO v_inflow_id;

  UPDATE public.products SET stock = stock + p_quantity WHERE id = p_product_id;

  RETURN v_inflow_id;
END;
$$;
