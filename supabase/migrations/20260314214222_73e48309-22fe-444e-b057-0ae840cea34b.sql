
-- Role enum
CREATE TYPE public.app_role AS ENUM ('owner', 'manager', 'cashier');

-- Payment method enum
CREATE TYPE public.payment_method AS ENUM ('cash', 'pos', 'transfer');

-- Stores table (multi-tenant)
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles per security best practice)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, store_id)
);

-- Products table (per store)
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  pack_size TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  cashier_id UUID NOT NULL REFERENCES auth.users(id),
  cashier_name TEXT NOT NULL,
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method payment_method NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sale items
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  pack_size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL
);

-- Inventory inflows
CREATE TABLE public.inventory_inflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  added_by UUID NOT NULL REFERENCES auth.users(id),
  added_by_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_inflows ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _store_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND store_id = _store_id AND role = _role
  )
$$;

-- Function to get user's store_id
CREATE OR REPLACE FUNCTION public.get_user_store_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT store_id FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Function to get user's role for a store
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID, _store_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id AND store_id = _store_id LIMIT 1
$$;

-- PROFILES policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- STORES policies
CREATE POLICY "Store members can view their store" ON public.stores
  FOR SELECT TO authenticated
  USING (id = public.get_user_store_id(auth.uid()));

CREATE POLICY "Authenticated users can create stores" ON public.stores
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their store" ON public.stores
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), id, 'owner'));

-- USER_ROLES policies
CREATE POLICY "Users can view roles in their store" ON public.user_roles
  FOR SELECT TO authenticated
  USING (store_id = public.get_user_store_id(auth.uid()));

CREATE POLICY "Owners can manage roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), store_id, 'owner'));

CREATE POLICY "Owners can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), store_id, 'owner'));

-- PRODUCTS policies
CREATE POLICY "Store members can view products" ON public.products
  FOR SELECT TO authenticated
  USING (store_id = public.get_user_store_id(auth.uid()));

CREATE POLICY "Managers and owners can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), store_id, 'owner') OR
    public.has_role(auth.uid(), store_id, 'manager')
  );

CREATE POLICY "Managers and owners can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), store_id, 'owner') OR
    public.has_role(auth.uid(), store_id, 'manager')
  );

CREATE POLICY "Owners can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), store_id, 'owner'));

-- SALES policies
CREATE POLICY "Store members can view sales" ON public.sales
  FOR SELECT TO authenticated
  USING (store_id = public.get_user_store_id(auth.uid()));

CREATE POLICY "Store members can create sales" ON public.sales
  FOR INSERT TO authenticated
  WITH CHECK (store_id = public.get_user_store_id(auth.uid()) AND cashier_id = auth.uid());

-- SALE_ITEMS policies
CREATE POLICY "Store members can view sale items" ON public.sale_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.sales s
      WHERE s.id = sale_items.sale_id
      AND s.store_id = public.get_user_store_id(auth.uid())
    )
  );

CREATE POLICY "Store members can insert sale items" ON public.sale_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales s
      WHERE s.id = sale_items.sale_id
      AND s.store_id = public.get_user_store_id(auth.uid())
    )
  );

-- INVENTORY_INFLOWS policies
CREATE POLICY "Store members can view inflows" ON public.inventory_inflows
  FOR SELECT TO authenticated
  USING (store_id = public.get_user_store_id(auth.uid()));

CREATE POLICY "Managers and owners can add inflows" ON public.inventory_inflows
  FOR INSERT TO authenticated
  WITH CHECK (
    (public.has_role(auth.uid(), store_id, 'owner') OR public.has_role(auth.uid(), store_id, 'manager'))
    AND added_by = auth.uid()
  );

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to complete a sale atomically
CREATE OR REPLACE FUNCTION public.complete_sale(
  p_store_id UUID,
  p_cashier_id UUID,
  p_cashier_name TEXT,
  p_total NUMERIC,
  p_payment_method payment_method,
  p_items JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sale_id UUID;
  v_item JSONB;
BEGIN
  INSERT INTO public.sales (store_id, cashier_id, cashier_name, total, payment_method)
  VALUES (p_store_id, p_cashier_id, p_cashier_name, p_total, p_payment_method)
  RETURNING id INTO v_sale_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.sale_items (sale_id, product_id, product_name, pack_size, quantity, unit_price)
    VALUES (
      v_sale_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_name',
      v_item->>'pack_size',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'unit_price')::NUMERIC
    );

    UPDATE public.products
    SET stock = stock - (v_item->>'quantity')::INTEGER
    WHERE id = (v_item->>'product_id')::UUID;
  END LOOP;

  RETURN v_sale_id;
END;
$$;

-- Function to add inflow atomically
CREATE OR REPLACE FUNCTION public.add_inventory_inflow(
  p_store_id UUID,
  p_product_id UUID,
  p_quantity INTEGER,
  p_added_by UUID,
  p_added_by_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inflow_id UUID;
BEGIN
  INSERT INTO public.inventory_inflows (store_id, product_id, quantity, added_by, added_by_name)
  VALUES (p_store_id, p_product_id, p_quantity, p_added_by, p_added_by_name)
  RETURNING id INTO v_inflow_id;

  UPDATE public.products SET stock = stock + p_quantity WHERE id = p_product_id;

  RETURN v_inflow_id;
END;
$$;
