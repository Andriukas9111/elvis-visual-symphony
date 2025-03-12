
-- Create the media bucket if it doesn't exist and set higher size limit
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, '2000MiB')
ON CONFLICT (id) DO UPDATE 
SET file_size_limit = '2000MiB';

-- Set very permissive policy for the media bucket
CREATE POLICY "Media Bucket Policy" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Create policy for public access to media bucket
CREATE POLICY "Public Access to Media" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'media');

-- Create a special folder for chunks
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('chunks', 'chunks', true, '2000MiB')
ON CONFLICT (id) DO NOTHING;

-- Set permissive policy for the chunks bucket
CREATE POLICY "Chunks Bucket Policy" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'chunks')
WITH CHECK (bucket_id = 'chunks');

-- Create policy for public access to chunks bucket
CREATE POLICY "Public Access to Chunks" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'chunks');
