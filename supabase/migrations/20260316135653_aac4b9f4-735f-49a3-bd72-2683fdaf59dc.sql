
-- Allow managers and owners to update sales (for credit_status)
CREATE POLICY "Managers and owners can update sales"
  ON public.sales FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));

-- Also allow the cashier who created the sale to update it (for setting customer_id at checkout)
CREATE POLICY "Cashier can update own sale"
  ON public.sales FOR UPDATE TO authenticated
  USING (cashier_id = auth.uid());
