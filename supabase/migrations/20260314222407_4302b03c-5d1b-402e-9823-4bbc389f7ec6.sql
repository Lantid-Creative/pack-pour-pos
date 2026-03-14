
-- Add phone column to profiles
ALTER TABLE public.profiles ADD COLUMN phone text;

-- Add phone column to stores
ALTER TABLE public.stores ADD COLUMN phone text;
