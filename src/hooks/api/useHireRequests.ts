
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { submitHireRequest, updateHireRequest } from '@/lib/api';

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

/**
 * Hook to submit a new hire request
 */
export const useSubmitHireRequest = (options?: {
  onSuccess?: (data: Tables<'hire_requests'>) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: async (requestData: Insertable<'hire_requests'>): Promise<Tables<'hire_requests'>> => {
      console.log('Submitting hire request:', requestData);
      
      try {
        const result = await submitHireRequest(requestData);
        console.log('Hire request submitted successfully:', result);
        return result;
      } catch (error) {
        console.error('Error submitting hire request:', error);
        throw error instanceof Error ? error : new Error('Failed to submit hire request');
      }
    },
    onSuccess: (data) => {
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error) => {
      if (options?.onError) {
        options.onError(error);
      }
    }
  });
};

/**
 * Hook to update an existing hire request
 */
export const useUpdateHireRequest = (options?: {
  onSuccess?: (data: Tables<'hire_requests'>) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Updatable<'hire_requests'>
    }): Promise<Tables<'hire_requests'>> => {
      console.log(`Updating hire request ${id}:`, updates);
      
      try {
        const result = await updateHireRequest(id, updates);
        console.log('Hire request updated successfully:', result);
        return result;
      } catch (error) {
        console.error('Error updating hire request:', error);
        throw error instanceof Error ? error : new Error('Failed to update hire request');
      }
    },
    onSuccess: (data) => {
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error) => {
      if (options?.onError) {
        options.onError(error);
      }
    }
  });
};
