
-- Create a table to track chunked file uploads
CREATE TABLE IF NOT EXISTS public.chunked_uploads (
  id UUID PRIMARY KEY,
  file_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  total_chunks INTEGER NOT NULL,
  total_size BIGINT NOT NULL,
  status TEXT NOT NULL,
  bucket_id TEXT NOT NULL,
  assembled_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add trigger to update timestamp
CREATE TRIGGER set_timestamp_chunked_uploads
BEFORE UPDATE ON public.chunked_uploads
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add RLS policies for chunked_uploads table
ALTER TABLE public.chunked_uploads ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select and insert chunked uploads
CREATE POLICY "Authenticated users can select chunked_uploads"
  ON public.chunked_uploads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert chunked_uploads"
  ON public.chunked_uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update chunked_uploads"
  ON public.chunked_uploads
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create a table to track chunked videos specifically
CREATE TABLE IF NOT EXISTS public.chunked_videos (
  id UUID PRIMARY KEY,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  total_size BIGINT NOT NULL,
  chunk_count INTEGER NOT NULL,
  chunk_files TEXT[] NOT NULL,
  status TEXT NOT NULL,
  bucket TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add trigger to update timestamp
CREATE TRIGGER set_timestamp_chunked_videos
BEFORE UPDATE ON public.chunked_videos
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add RLS policies for chunked_videos table
ALTER TABLE public.chunked_videos ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select and insert chunked videos
CREATE POLICY "Authenticated users can select chunked_videos"
  ON public.chunked_videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert chunked_videos"
  ON public.chunked_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update chunked_videos"
  ON public.chunked_videos
  FOR UPDATE
  TO authenticated
  USING (true);
