
-- Create the media bucket if it doesn't exist and set higher size limit
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, '1000MiB')
ON CONFLICT (id) DO UPDATE 
SET file_size_limit = '1000MiB';

-- Set very permissive policy for the media bucket
CREATE POLICY "Media Bucket Policy" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');
