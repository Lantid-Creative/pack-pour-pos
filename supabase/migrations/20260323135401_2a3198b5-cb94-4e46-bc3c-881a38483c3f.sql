
-- Add 'split' to payment_method enum
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'split';

-- Create sale_payments table for split payment details
CREATE TABLE public.sale_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  payment_method TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sale_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Store members can view sale payments"
  ON public.sale_payments FOR SELECT TO authenticated
  USING (store_id = get_user_store_id(auth.uid()));

CREATE POLICY "Store members can insert sale payments"
  ON public.sale_payments FOR INSERT TO authenticated
  WITH CHECK (store_id = get_user_store_id(auth.uid()));
