
-- Add cost_price to products (default 0, nullable so existing products work)
ALTER TABLE public.products ADD COLUMN cost_price NUMERIC NOT NULL DEFAULT 0;

-- Add cost_price to sale_items so we can track profit per sale historically
ALTER TABLE public.sale_items ADD COLUMN cost_price NUMERIC NOT NULL DEFAULT 0;
