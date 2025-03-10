
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

export type HireRequestsQueryOptions = {
  pageSize?: number;
  page?: number;
  status?: string;
};

/**
 * Hook to fetch hire requests with proper typing
 */
export const useHireRequests = (options?: HireRequestsQueryOptions) => {
  const { pageSize = 10, page = 1, status } = options || {};
  
  return useQuery({
    queryKey: ['hire_requests', { page, pageSize, status }],
    queryFn: async (): Promise<Tables<'hire_requests'>[]> => {
      console.log('Fetching hire requests with options:', options);
      
      // Calculate range
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      let query = supabase
        .from('hire_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching hire requests:', error);
        throw new Error('Failed to fetch hire requests: ' + error.message);
      }
      
      return data || [];
    },
  });
};
