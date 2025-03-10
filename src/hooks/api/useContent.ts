
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { queryClient } from './queryClient';

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
