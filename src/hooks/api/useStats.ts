import { useQuery } from '@tanstack/react-query';
import { StatData, StatItem } from '@/components/home/about/types';
import { supabase } from '@/lib/supabase';

export type { StatItem };

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as StatData[];
    }
  });
};

export const useCreateStat = () => {
  // Implementation for creating a stat
  // This would typically use useMutation from react-query
};

export const useUpdateStat = () => {
  // Implementation for updating a stat
  // This would typically use useMutation from react-query
};

export const useDeleteStat = () => {
  // Implementation for deleting a stat
  // This would typically use useMutation from react-query
};
