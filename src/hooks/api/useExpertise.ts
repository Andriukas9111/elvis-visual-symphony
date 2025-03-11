
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Expertise } from '@/types/about.types';

// Re-export ExpertiseItem type
export type { Expertise as ExpertiseItem } from '@/types/about.types';

export const useExpertise = () => {
  return useQuery({
    queryKey: ['expertise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as Expertise[];
    }
  });
};
