
-- Function to get storage configuration from the media bucket
CREATE OR REPLACE FUNCTION public.get_storage_config()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  config jsonb;
  file_size_limit_value bigint;
BEGIN
  -- Try to fetch configuration from storage.buckets
  SELECT jsonb_build_object(
    'file_size_limit', file_size_limit,
    'allowed_mime_types', allowed_mime_types
  ) INTO config
  FROM storage.buckets
  WHERE id = 'media'
  LIMIT 1;
  
  -- Get the actual numeric value for logging
  SELECT file_size_limit INTO file_size_limit_value
  FROM storage.buckets
  WHERE id = 'media'
  LIMIT 1;
  
  -- Add helpful context to the response
  RETURN jsonb_build_object(
    'file_size_limit', config->'file_size_limit',
    'allowed_mime_types', config->'allowed_mime_types',
    'file_size_limit_bytes', file_size_limit_value,
    'file_size_limit_formatted', file_size_limit_value || 'MiB',
    'server_request_size_limit', '8MB'  -- This is the default for free tier
  );
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_storage_config() TO anon, authenticated;
