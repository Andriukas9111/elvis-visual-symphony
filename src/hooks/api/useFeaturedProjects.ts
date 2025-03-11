
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ['featuredProjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('is_featured', true)
        .eq('is_published', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching featured projects:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};
