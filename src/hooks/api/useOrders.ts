
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { queryClient } from './queryClient';

// Orders hooks
export const useOrders = (userId?: string, options?: UseQueryOptions<Tables<'orders'>[]>) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => api.getOrders(userId),
    ...options,
  });
};

export const useOrderById = (id: string, options?: UseQueryOptions<Tables<'orders'> | null>) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => api.getOrderById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateOrder = (options?: UseMutationOptions<Tables<'orders'>, Error, Insertable<'orders'>>) => {
  return useMutation({
    mutationFn: (order) => api.createOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({ title: 'Order created', description: 'Your order has been successfully created.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Order failed', 
        description: error.message || 'Failed to create order. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useUpdateOrder = (options?: UseMutationOptions<Tables<'orders'>, Error, { id: string; updates: Updatable<'orders'> }>) => {
  return useMutation({
    mutationFn: ({ id, updates }) => api.updateOrder(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
      toast({ title: 'Order updated', description: 'The order has been successfully updated.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Failed to update order. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};
