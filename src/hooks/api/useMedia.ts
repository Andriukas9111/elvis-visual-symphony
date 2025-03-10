
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { queryClient } from './queryClient';

// Media hooks
export const useMedia = (
  options?: { 
    category?: string;
    featured?: boolean;
    limit?: number;
    search?: string;
    tags?: string[];
    orientation?: string;
  }, 
  queryOptions?: UseQueryOptions<Tables<'media'>[]>
) => {
  return useQuery({
    queryKey: ['media', options],
    queryFn: async () => {
      try {
        console.log("Fetching media with options:", options);
        const result = await api.getMedia(options);
        console.log("Media fetched successfully:", result);
        return result;
      } catch (error) {
        console.error("Error fetching media:", error);
        throw error;
      }
    },
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
