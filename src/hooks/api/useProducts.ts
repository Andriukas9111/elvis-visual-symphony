
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { queryClient } from './queryClient';

// Products hooks
export const useProducts = (
  options?: { 
    category?: string;
    featured?: boolean;
    limit?: number;
    search?: string;
    tags?: string[];
  }, 
  queryOptions?: UseQueryOptions<Tables<'products'>[]>
) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => api.getProducts(options),
    ...queryOptions,
  });
};

export const useProductBySlug = (slug: string, options?: UseQueryOptions<Tables<'products'> | null>) => {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: () => api.getProductBySlug(slug),
    enabled: !!slug,
    ...options,
  });
};

export const useCreateProduct = (options?: UseMutationOptions<Tables<'products'>, Error, Insertable<'products'>>) => {
  return useMutation({
    mutationFn: (product) => api.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product created', description: 'The product has been successfully created.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Creation failed', 
        description: error.message || 'Failed to create product. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useUpdateProduct = (options?: UseMutationOptions<Tables<'products'>, Error, { id: string; updates: Updatable<'products'> }>) => {
  return useMutation({
    mutationFn: ({ id, updates }) => api.updateProduct(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      toast({ title: 'Product updated', description: 'The product has been successfully updated.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Failed to update product. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useDeleteProduct = (options?: UseMutationOptions<boolean, Error, string>) => {
  return useMutation({
    mutationFn: (id) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted', description: 'The product has been successfully deleted.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Deletion failed', 
        description: error.message || 'Failed to delete product. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};
