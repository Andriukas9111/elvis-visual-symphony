
-- Drop all existing tables and policies related to videos and chunked uploads
DROP TABLE IF EXISTS public.chunked_uploads CASCADE;
DROP TABLE IF EXISTS public.chunked_videos CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;

-- Drop all policies related to video storage
DROP POLICY IF EXISTS "Videos Bucket Policy" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Videos" ON storage.objects;
DROP POLICY IF EXISTS "Chunks Bucket Policy" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Chunks" ON storage.objects;
DROP POLICY IF EXISTS "Thumbnails Bucket Policy" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Thumbnails" ON storage.objects;

-- Create storage buckets with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('videos', 'videos', true, '10000MiB')
ON CONFLICT (id) DO UPDATE
SET file_size_limit = '10000MiB', public = true;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('thumbnails', 'thumbnails', true, '50MiB')
ON CONFLICT (id) DO UPDATE
SET file_size_limit = '50MiB', public = true;

-- Set permissive policies for videos bucket (allowing any authenticated user to upload)
CREATE POLICY "Anyone can select from videos bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can insert into videos bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can update videos bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete from videos bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'videos');

-- Set permissive policies for thumbnails bucket
CREATE POLICY "Anyone can select from thumbnails bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can insert into thumbnails bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can update thumbnails bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can delete from thumbnails bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'thumbnails');

-- Add a video_url column to the media table if it doesn't already exist
ALTER TABLE public.media 
ADD COLUMN IF NOT EXISTS video_url TEXT;
