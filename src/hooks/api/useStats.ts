import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { StatData, StatItem } from '@/components/home/about/types';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      // This is a placeholder since the stats table has been removed
      return [] as StatData[];
    },
  });
};

// Properly export the type with 'export type'
export type { StatItem };
