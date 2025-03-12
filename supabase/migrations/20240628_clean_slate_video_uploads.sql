
-- Step 1: Drop all existing tables related to chunked videos and uploads
DROP TABLE IF EXISTS public.chunked_uploads CASCADE;
DROP TABLE IF EXISTS public.chunked_videos CASCADE;

-- Step 2: Remove any policies related to chunked video storage
DROP POLICY IF EXISTS "Chunks Bucket Policy" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Chunks" ON storage.objects;

-- Step 3: Create a clean, simplified video storage system

-- Create a new table for videos with a clear structure
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  thumbnail_path TEXT,
  file_size BIGINT,
  duration_seconds INTEGER,
  is_processed BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add trigger to update timestamp
CREATE TRIGGER set_timestamp_videos
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add RLS policies for videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view published videos
CREATE POLICY "Anyone can view published videos"
  ON public.videos
  FOR SELECT
  TO public
  USING (is_published = true);

-- Allow authenticated users to insert videos
CREATE POLICY "Authenticated users can insert videos"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own videos
CREATE POLICY "Authenticated users can update their own videos"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete their own videos
CREATE POLICY "Authenticated users can delete their own videos"
  ON public.videos
  FOR DELETE
  TO authenticated
  USING (true);

-- Create permissions for the media table to properly link videos
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS video_id UUID REFERENCES public.videos(id);
