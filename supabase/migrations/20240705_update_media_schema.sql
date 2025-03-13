
-- Update media table to use metadata field
ALTER TABLE public.media DROP COLUMN IF EXISTS file_size;
ALTER TABLE public.media DROP COLUMN IF EXISTS file_type;

-- Ensure metadata jsonb field exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'media' 
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.media ADD COLUMN metadata JSONB DEFAULT NULL;
  END IF;
END $$;

-- Make sure video_id field exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'media' 
    AND column_name = 'video_id'
  ) THEN
    ALTER TABLE public.media ADD COLUMN video_id UUID DEFAULT NULL;
  END IF;
END $$;

-- Update any references to file_size in existing records
UPDATE public.media
SET metadata = jsonb_build_object('file_size', file_size::bigint)
WHERE metadata IS NULL AND file_size IS NOT NULL;

-- Ensure file_type data is preserved
UPDATE public.media
SET metadata = CASE
  WHEN metadata IS NULL THEN jsonb_build_object('file_type', file_type)
  ELSE jsonb_set(metadata, '{file_type}', to_jsonb(file_type))
END
WHERE file_type IS NOT NULL;
