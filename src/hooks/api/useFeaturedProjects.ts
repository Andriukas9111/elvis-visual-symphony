
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

export interface FeaturedProject {
  id: string;
  title: string;
  description?: string;
  thumbnail_url: string;
  video_url?: string;
  url: string;
  is_featured: boolean;
  type: 'image' | 'video';
  order_index: number;
}

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ['featuredProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_projects')
        .select('*')
        .eq('is_featured', true)
        .order('order_index');
      
      if (error) {
        console.error('Error fetching featured projects:', error);
        throw error;
      }
      
      return data as FeaturedProject[];
    }
  });
};
