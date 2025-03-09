import { useQuery, useMutation, QueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Tables, Insertable, Updatable } from '@/types/supabase';

// Create a global queryClient that can be used outside of React components
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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

// Media hooks
export const useMedia = (
  options?: { 
    category?: string;
    featured?: boolean;
    limit?: number;
    search?: string;
    tags?: string[];
  }, 
  queryOptions?: UseQueryOptions<Tables<'media'>[]>
) => {
  return useQuery({
    queryKey: ['media', options],
    queryFn: () => api.getMedia(options),
    ...queryOptions,
  });
};

export const useMediaBySlug = (slug: string, options?: UseQueryOptions<Tables<'media'> | null>) => {
  return useQuery({
    queryKey: ['media', slug],
    queryFn: () => api.getMediaBySlug(slug),
    enabled: !!slug,
    ...options,
  });
};

export const useCreateMedia = (options?: UseMutationOptions<Tables<'media'>, Error, Insertable<'media'>>) => {
  return useMutation({
    mutationFn: (media) => api.createMedia(media),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast({ title: 'Media created', description: 'The media item has been successfully created.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Creation failed', 
        description: error.message || 'Failed to create media. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useUpdateMedia = (options?: UseMutationOptions<Tables<'media'>, Error, { id: string; updates: Updatable<'media'> }>) => {
  return useMutation({
    mutationFn: ({ id, updates }) => api.updateMedia(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media', variables.id] });
      toast({ title: 'Media updated', description: 'The media item has been successfully updated.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Failed to update media. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useDeleteMedia = (options?: UseMutationOptions<boolean, Error, string>) => {
  return useMutation({
    mutationFn: (id) => api.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast({ title: 'Media deleted', description: 'The media item has been successfully deleted.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Deletion failed', 
        description: error.message || 'Failed to delete media. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

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

// Content hooks
export const useContent = (section?: string, options?: UseQueryOptions<Tables<'content'>[]>) => {
  return useQuery({
    queryKey: ['content', section],
    queryFn: () => api.getContent(section),
    ...options,
  });
};

export const useCreateContent = (options?: UseMutationOptions<Tables<'content'>, Error, Insertable<'content'>>) => {
  return useMutation({
    mutationFn: (content) => api.createContent(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({ title: 'Content created', description: 'The content has been successfully created.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Creation failed', 
        description: error.message || 'Failed to create content. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useUpdateContent = (options?: UseMutationOptions<Tables<'content'>, Error, { id: string; updates: Updatable<'content'> }>) => {
  return useMutation({
    mutationFn: ({ id, updates }) => api.updateContent(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['content', variables.id] });
      toast({ title: 'Content updated', description: 'The content has been successfully updated.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Failed to update content. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useDeleteContent = (options?: UseMutationOptions<boolean, Error, string>) => {
  return useMutation({
    mutationFn: (id) => api.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
      toast({ title: 'Content deleted', description: 'The content has been successfully deleted.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Deletion failed', 
        description: error.message || 'Failed to delete content. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

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
        return [];
      }
      try {
        const data = await api.getHireRequests();
        console.log('Hire requests fetched successfully:', data);
        return data;
      } catch (error) {
        console.error('Error fetching hire requests:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    ...options,
  });
};

export const useUpdateHireRequest = (options?: UseMutationOptions<Tables<'hire_requests'>, Error, { id: string; updates: Updatable<'hire_requests'> }>) => {
  return useMutation({
    mutationFn: ({ id, updates }) => api.updateHireRequest(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hire_requests'] });
      queryClient.invalidateQueries({ queryKey: ['hire_requests', variables.id] });
      toast({ title: 'Request updated', description: 'The hire request has been successfully updated.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Update failed', 
        description: error.message || 'Failed to update hire request. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

// File upload hooks
export const useUploadFile = (options?: UseMutationOptions<string, Error, { bucket: string; path: string; file: File }>) => {
  return useMutation({
    mutationFn: ({ bucket, path, file }) => api.uploadFile(bucket, path, file),
    onSuccess: () => {
      toast({ title: 'File uploaded', description: 'Your file has been successfully uploaded.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Upload failed', 
        description: error.message || 'Failed to upload file. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

export const useDeleteFile = (options?: UseMutationOptions<boolean, Error, { bucket: string; path: string }>) => {
  return useMutation({
    mutationFn: ({ bucket, path }) => api.deleteFile(bucket, path),
    onSuccess: () => {
      toast({ title: 'File deleted', description: 'The file has been successfully deleted.' });
    },
    onError: (error) => {
      toast({ 
        title: 'Deletion failed', 
        description: error.message || 'Failed to delete file. Please try again.', 
        variant: 'destructive' 
      });
    },
    ...options,
  });
};

// Search hook
export const useSearch = (
  query: string,
  options?: {
    tables?: Array<'products' | 'media' | 'content'>;
    limit?: number;
  },
  queryOptions?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ['search', query, options],
    queryFn: () => api.search(query, options),
    enabled: query.length > 2, // Only search when query is at least 3 characters
    ...queryOptions,
  });
};
