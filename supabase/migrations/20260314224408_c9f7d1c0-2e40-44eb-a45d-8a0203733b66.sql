-- Add trial_ends_at column to stores (14 days from creation by default)
ALTER TABLE public.stores ADD COLUMN trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '14 days');

-- Backfill existing stores
UPDATE public.stores SET trial_ends_at = created_at + interval '14 days' WHERE trial_ends_at IS NOT NULL;