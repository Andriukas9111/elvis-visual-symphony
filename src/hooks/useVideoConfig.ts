
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface VideoConfig {
  id: string;
  autoplay_default: boolean;
  loop_default: boolean;
  default_volume: number;
  preload_strategy: 'auto' | 'metadata' | 'none';
  quality_selection: 'auto' | 'high' | 'medium' | 'low';
  enable_theater_mode: boolean;
  mute_on_autoplay: boolean;
  enable_keyboard_shortcuts: boolean;
  created_at?: string;
  updated_at?: string;
}

const defaultConfig: VideoConfig = {
  id: 'global',
  autoplay_default: false,
  loop_default: false,
  default_volume: 0.7,
  preload_strategy: 'metadata',
  quality_selection: 'auto',
  enable_theater_mode: true,
  mute_on_autoplay: true,
  enable_keyboard_shortcuts: true,
};

export const useVideoConfig = () => {
  const [config, setConfig] = useState<VideoConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to get the video configuration from the database
        const { data, error } = await supabase
          .from('video_config')
          .select('*')
          .eq('id', 'global')
          .single();
          
        if (error) {
          // If there's no data yet, we'll use the defaults
          if (error.code === 'PGRST116') {
            console.log('No video configuration found, using defaults');
            setConfig(defaultConfig);
          } else {
            throw error;
          }
        } else if (data) {
          setConfig(data);
        }
      } catch (err: any) {
        console.error('Error fetching video configuration:', err.message);
        setError(err);
        // Still use default config even if there was an error
        setConfig(defaultConfig);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
    
    // Set up subscription to listen for changes to the video config
    const channel = supabase
      .channel('video_config_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_config',
          filter: 'id=eq.global'
        },
        (payload) => {
          console.log('Video config changed:', payload);
          if (payload.new) {
            setConfig(payload.new as VideoConfig);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { config, isLoading, error };
};
