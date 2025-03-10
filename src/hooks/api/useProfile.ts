
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Tables, Updatable } from '@/types/supabase';
import { queryClient } from './queryClient';

// Profile hooks
export const useProfile = (options?: UseQueryOptions<Tables<'profiles'> | null>) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: api.getCurrentProfile,
    ...options,
  });
};

export const useUpdateProfile = (options?: UseMutationOptions<Tables<'profiles'>, Error, Updatable<'profiles'>>) => {
  return useMutation({
    mutationFn: (updates) => api.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Profile updated', description: 'Your profile has been successfully updated.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Failed to update profile. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};
