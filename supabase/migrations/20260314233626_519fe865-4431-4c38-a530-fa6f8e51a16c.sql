
ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS printer_type text NOT NULL DEFAULT '80mm',
  ADD COLUMN IF NOT EXISTS receipt_header text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS receipt_footer text NOT NULL DEFAULT 'Thank you for your patronage!',
  ADD COLUMN IF NOT EXISTS receipt_show_address boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS receipt_show_phone boolean NOT NULL DEFAULT true;
