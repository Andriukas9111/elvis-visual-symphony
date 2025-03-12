
-- Function to get storage configuration from the media bucket
CREATE OR REPLACE FUNCTION public.get_storage_config()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  config jsonb;
BEGIN
  -- Try to fetch configuration from storage.buckets
  SELECT json_build_object(
    'file_size_limit', config->'file_size_limit',
    'allowed_mime_types', config->'allowed_mime_types'
  )::jsonb INTO config
  FROM storage.buckets
  WHERE id = 'media'
  LIMIT 1;
  
  -- Return the configuration
  RETURN config;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_storage_config() TO anon, authenticated;
