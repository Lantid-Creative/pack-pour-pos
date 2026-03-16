
-- Create customers table
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view customers"
  ON public.customers FOR SELECT TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Store members can insert customers"
  ON public.customers FOR INSERT TO authenticated
  WITH CHECK (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Managers and owners can update customers"
  ON public.customers FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));

CREATE POLICY "Owners can delete customers"
  ON public.customers FOR DELETE TO authenticated
  USING (has_role(auth.uid(), store_id, 'owner'::app_role));

-- Add 'credit' to payment_method enum
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'credit';

-- Add customer_id and credit_status to sales
ALTER TABLE public.sales ADD COLUMN customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;
ALTER TABLE public.sales ADD COLUMN credit_status text DEFAULT NULL;

-- Create credit_payments table for tracking payments on credit sales
CREATE TABLE public.credit_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_method text NOT NULL DEFAULT 'cash',
  recorded_by uuid NOT NULL,
  recorded_by_name text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store members can view credit payments"
  ON public.credit_payments FOR SELECT TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Managers and owners can insert credit payments"
  ON public.credit_payments FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), store_id, 'owner'::app_role) OR has_role(auth.uid(), store_id, 'manager'::app_role));
