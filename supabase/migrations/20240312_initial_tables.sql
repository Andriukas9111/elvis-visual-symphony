
-- Create stats table
CREATE TABLE IF NOT EXISTS public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_name TEXT NOT NULL,
  value INTEGER NOT NULL,
  suffix TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create social_platforms table
CREATE TABLE IF NOT EXISTS public.social_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create video_config table
CREATE TABLE IF NOT EXISTS public.video_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expertise table
CREATE TABLE IF NOT EXISTS public.expertise (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add timestamps triggers
CREATE TRIGGER set_timestamp_stats
    BEFORE UPDATE ON public.stats
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_timestamp_social_platforms
    BEFORE UPDATE ON public.social_platforms
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_timestamp_video_config
    BEFORE UPDATE ON public.video_config
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER set_timestamp_expertise
    BEFORE UPDATE ON public.expertise
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Add some basic RLS policies
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Everyone can view stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Everyone can view social_platforms" ON public.social_platforms FOR SELECT USING (true);
CREATE POLICY "Everyone can view video_config" ON public.video_config FOR SELECT USING (true);
CREATE POLICY "Everyone can view expertise" ON public.expertise FOR SELECT USING (true);

-- Only authenticated users can modify
CREATE POLICY "Authenticated users can modify stats" ON public.stats 
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify social_platforms" ON public.social_platforms
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify video_config" ON public.video_config
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify expertise" ON public.expertise
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
