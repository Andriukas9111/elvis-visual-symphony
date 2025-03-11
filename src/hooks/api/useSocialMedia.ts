
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialPlatformData } from '@/types/about.types';

export const useSocialMedia = () => {
  return useQuery({
    queryKey: ['social-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as SocialPlatformData[];
    }
  });
};

export const useSocialMediaById = (id: string) => {
  return useQuery({
    queryKey: ['social-media', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as SocialPlatformData;
    },
    enabled: !!id
  });
};
