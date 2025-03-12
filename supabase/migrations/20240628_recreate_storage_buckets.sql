
-- Clean and recreate storage buckets for videos with proper permissions

-- Create video bucket with higher size limits
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('videos', 'videos', true, '10000MiB')
ON CONFLICT (id) DO UPDATE
SET file_size_limit = '10000MiB';

-- Create thumbnails bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Set permissive policies for the videos bucket
CREATE POLICY "Videos Bucket Policy" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');

-- Create policy for public access to videos bucket
CREATE POLICY "Public Access to Videos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'videos');

-- Set permissive policies for the thumbnails bucket
CREATE POLICY "Thumbnails Bucket Policy" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'thumbnails')
WITH CHECK (bucket_id = 'thumbnails');

-- Create policy for public access to thumbnails bucket
CREATE POLICY "Public Access to Thumbnails" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'thumbnails');
