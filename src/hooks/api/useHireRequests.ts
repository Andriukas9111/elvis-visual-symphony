
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { queryClient } from './queryClient';

// Hire Request hooks
export const useSubmitHireRequest = (options?: UseMutationOptions<Tables<'hire_requests'>, Error, Insertable<'hire_requests'>>) => {
  return useMutation({
    mutationFn: async (request) => {
      console.log('In mutationFn, attempting to submit hire request:', request);
      try {
        const response = await api.submitHireRequest(request);
        console.log('Hire request submitted successfully:', response);
        return response;
      } catch (error) {
        console.error('Error in submitHireRequest mutationFn:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('Hire request submitted successfully in onSuccess handler');
      toast({ title: 'Request submitted', description: 'Your hire request has been successfully submitted.' });
    },
    onError: (error) => {
      console.error('Error in submitHireRequest onError handler:', error);
      toast({ 
        title: 'Submission failed', 
        description: error.message || 'Failed to submit hire request. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useHireRequests = (options?: UseQueryOptions<Tables<'hire_requests'>[]>) => {
  const { isAdmin } = useAuth();
  
  return useQuery({
    queryKey: ['hire_requests'],
    queryFn: async () => {
      console.log('Fetching hire requests, user is admin:', isAdmin);
      if (!isAdmin) {
        console.warn('Non-admin user attempting to fetch hire requests');
        throw new Error('Access denied: Only admins can view hire requests');
      }
      
      try {
        const data = await api.getHireRequests();
        console.log('Hire requests fetched successfully:', data);
        return data;
      } catch (error) {
        console.error('Error fetching hire requests in queryFn:', error);
        console.error('Error details:', error instanceof Error ? error.message : JSON.stringify(error));
        
        // Check for specific error messages related to RLS or auth
        if (error instanceof Error) {
          if (error.message.includes('permission denied')) {
            throw new Error('Permission denied: This might be an RLS policy issue. Please check if your user has admin role properly set.');
          }
        }
        
        throw error;
      }
    },
    enabled: isAdmin,
    retry: 1, // Limit retries when there's an error
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid repeated errors
    ...options,
  });
};

export const useUpdateHireRequest = (options?: UseMutationOptions<Tables<'hire_requests'>, Error, { id: string; updates: Updatable<'hire_requests'> }>) => {
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      console.log(`Updating hire request ${id}:`, updates);
      try {
        const result = await api.updateHireRequest(id, updates);
        console.log('Update successful:', result);
        return result;
      } catch (error) {
        console.error('Error in updateHireRequest mutationFn:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hire_requests'] });
      queryClient.invalidateQueries({ queryKey: ['hire_requests', variables.id] });
      toast({ title: 'Request updated', description: 'The hire request has been successfully updated.' });
    },
    onError: (error) => {
      console.error('Error in updateHireRequest onError handler:', error);
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Failed to update hire request. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};
