
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

export const useSocialMedia = () => {
  return useQuery({
    queryKey: ['socialMedia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error fetching social media links:', error);
        throw error;
      }
      
      return data as SocialMediaLink[];
    }
  });
};
