
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface AccomplishmentData {
  id: string;
  title: string;
  value: string;
  suffix?: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

export const useAccomplishments = () => {
  return useQuery({
    queryKey: ['accomplishments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accomplishments')
        .select('*')
        .order('order_index');
      
      if (error) {
        console.error('Error fetching accomplishments:', error);
        throw error;
      }
      
      return (data || []) as AccomplishmentData[];
    },
  });
};
