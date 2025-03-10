
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { queryClient } from './queryClient';

// Subscriber hooks
export const useSubscribers = (options?: UseQueryOptions<any>) => {
  return useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching subscribers:', error);
        throw error;
      }
    },
    ...options,
  });
};

export const useAddSubscriber = (options?: UseMutationOptions<any, Error, { email: string }>) => {
  return useMutation({
    mutationFn: async ({ email }) => {
      try {
        const { data, error } = await supabase
          .from('subscribers')
          .insert([{ email }])
          .select();
          
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error('Error adding subscriber:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'Subscribed!', description: 'You have been subscribed to the newsletter.' });
    },
    onError: (error) => {
      if (error.message.includes('duplicate')) {
        toast({ 
          title: 'Already subscribed', 
          description: 'This email is already subscribed to our newsletter.'
        });
      } else {
        toast({ 
          title: 'Subscription failed', 
          description: error.message || 'Please try again later.', 
          variant: 'destructive' 
        });
      }
    },
    ...options,
  });
};

export const useDeleteSubscriber = (options?: UseMutationOptions<boolean, Error, string>) => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        const { error } = await supabase
          .from('subscribers')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      toast({ title: 'Subscriber removed', description: 'The subscriber has been removed.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Removal failed', 
        description: error.message || 'Failed to remove subscriber. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};
