
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface StatData {
  id: string;
  title: string;
  subtitle?: string;
  value: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

export const useStats = () => {
  return useQuery({
    queryKey: ['social-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_stats')
        .select('*')
        .order('order_index');
      
      if (error) {
        console.error('Error fetching social stats:', error);
        throw error;
      }
      
      return (data || []) as StatData[];
    },
  });
};
