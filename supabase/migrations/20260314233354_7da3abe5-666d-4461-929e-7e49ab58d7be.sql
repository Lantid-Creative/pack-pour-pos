
CREATE OR REPLACE FUNCTION public.prevent_negative_stock()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.stock < 0 THEN
    RAISE EXCEPTION 'Stock cannot go below 0. Current attempted value: %', NEW.stock;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER check_stock_not_negative
  BEFORE UPDATE OF stock ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_negative_stock();

CREATE TRIGGER check_stock_not_negative_insert
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_negative_stock();
