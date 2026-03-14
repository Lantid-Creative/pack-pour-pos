
CREATE OR REPLACE FUNCTION public.prevent_negative_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.stock < 0 THEN
    RAISE EXCEPTION 'Stock cannot go below 0. Current attempted value: %', NEW.stock;
  END IF;
  RETURN NEW;
END;
$function$;
