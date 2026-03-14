
-- Update complete_sale to capture cost_price in sale_items
CREATE OR REPLACE FUNCTION public.complete_sale(p_store_id uuid, p_cashier_id uuid, p_cashier_name text, p_total numeric, p_payment_method payment_method, p_items jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  v_sale_id UUID;
  v_item JSONB;
  v_cost_price NUMERIC;
BEGIN
  INSERT INTO public.sales (store_id, cashier_id, cashier_name, total, payment_method)
  VALUES (p_store_id, p_cashier_id, p_cashier_name, p_total, p_payment_method)
  RETURNING id INTO v_sale_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Get cost_price from products table
    SELECT cost_price INTO v_cost_price FROM public.products WHERE id = (v_item->>'product_id')::UUID;

    INSERT INTO public.sale_items (sale_id, product_id, product_name, pack_size, quantity, unit_price, cost_price)
    VALUES (
      v_sale_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_name',
      v_item->>'pack_size',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'unit_price')::NUMERIC,
      COALESCE(v_cost_price, 0)
    );

    UPDATE public.products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = (v_item->>'product_id')::UUID;
  END LOOP;

  RETURN v_sale_id;
END;
$$;
