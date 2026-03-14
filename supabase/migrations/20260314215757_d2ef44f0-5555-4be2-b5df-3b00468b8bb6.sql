
-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending');

-- Create subscription plan enum
CREATE TYPE public.subscription_plan AS ENUM ('starter', 'business', 'enterprise');

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'starter',
  status subscription_status NOT NULL DEFAULT 'pending',
  paystack_reference TEXT,
  paystack_subscription_code TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  started_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Owners can view their store subscription
CREATE POLICY "Store owners can view subscriptions"
ON public.subscriptions FOR SELECT TO authenticated
USING (has_role(auth.uid(), store_id, 'owner'::app_role));

-- Owners can insert subscriptions
CREATE POLICY "Store owners can create subscriptions"
ON public.subscriptions FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), store_id, 'owner'::app_role));

-- Owners can update subscriptions
CREATE POLICY "Store owners can update subscriptions"
ON public.subscriptions FOR UPDATE TO authenticated
USING (has_role(auth.uid(), store_id, 'owner'::app_role));

-- All store members can check subscription status (for gating)
CREATE POLICY "Store members can check subscription"
ON public.subscriptions FOR SELECT TO authenticated
USING (store_id = get_user_store_id(auth.uid()));
