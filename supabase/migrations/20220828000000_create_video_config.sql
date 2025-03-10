
-- Create the video configuration table
CREATE TABLE IF NOT EXISTS public.video_config (
    id TEXT PRIMARY KEY,
    autoplay_default BOOLEAN DEFAULT false,
    loop_default BOOLEAN DEFAULT false,
    default_volume NUMERIC CHECK (default_volume >= 0 AND default_volume <= 1) DEFAULT 0.7,
    preload_strategy TEXT CHECK (preload_strategy IN ('auto', 'metadata', 'none')) DEFAULT 'metadata',
    quality_selection TEXT CHECK (quality_selection IN ('auto', 'high', 'medium', 'low')) DEFAULT 'auto',
    enable_theater_mode BOOLEAN DEFAULT true,
    mute_on_autoplay BOOLEAN DEFAULT true,
    enable_keyboard_shortcuts BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Comment on the tables and columns
COMMENT ON TABLE public.video_config IS 'Global configuration settings for the video player system';
COMMENT ON COLUMN public.video_config.id IS 'Configuration identifier (usually ''global'')';
COMMENT ON COLUMN public.video_config.autoplay_default IS 'Whether videos should autoplay by default';
COMMENT ON COLUMN public.video_config.loop_default IS 'Whether videos should loop by default';
COMMENT ON COLUMN public.video_config.default_volume IS 'Default volume level (0-1)';
COMMENT ON COLUMN public.video_config.preload_strategy IS 'How videos should be preloaded (auto, metadata, none)';
COMMENT ON COLUMN public.video_config.quality_selection IS 'Default quality selection strategy';
COMMENT ON COLUMN public.video_config.enable_theater_mode IS 'Allow videos to be expanded to theater mode';
COMMENT ON COLUMN public.video_config.mute_on_autoplay IS 'Whether autoplay videos should be muted initially';
COMMENT ON COLUMN public.video_config.enable_keyboard_shortcuts IS 'Enable keyboard shortcuts for video control';

-- Add RLS policies
ALTER TABLE public.video_config ENABLE ROW LEVEL SECURITY;

-- Add trigger for updated_at
CREATE TRIGGER set_timestamp_video_config
BEFORE UPDATE ON public.video_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Allow admins to manage video config
CREATE POLICY admin_manage_video_config
ON public.video_config
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Allow anyone to view video config
CREATE POLICY view_video_config
ON public.video_config
FOR SELECT
TO anon, authenticated
USING (true);

-- Insert default config
INSERT INTO public.video_config (
    id, 
    autoplay_default, 
    loop_default, 
    default_volume, 
    preload_strategy, 
    quality_selection, 
    enable_theater_mode, 
    mute_on_autoplay, 
    enable_keyboard_shortcuts
) VALUES (
    'global',
    false,
    false,
    0.7,
    'metadata',
    'auto',
    true,
    true,
    true
) ON CONFLICT (id) DO NOTHING;

-- Update the real-time publication
-- This allows client-side listeners to receive updates to the video_config table
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_config;

-- Enable replica identity so we can get the previous values
ALTER TABLE public.video_config REPLICA IDENTITY FULL;
