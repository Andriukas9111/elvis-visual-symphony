
-- Function to increment download count safely
CREATE OR REPLACE FUNCTION public.increment_download_count(order_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_limit INTEGER;
BEGIN
  -- Get current download count and limit
  SELECT download_count, download_limit 
  INTO current_count, max_limit 
  FROM public.orders 
  WHERE id = order_id;
  
  -- Check if download limit reached
  IF current_count >= max_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Increment download count
  UPDATE public.orders
  SET download_count = download_count + 1
  WHERE id = order_id;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant usage to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_download_count TO authenticated;
