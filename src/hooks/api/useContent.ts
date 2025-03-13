
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type ContentItem = {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
  media_url?: string;
  button_text?: string;
  button_url?: string;
  ordering?: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export const useContent = (section: string) => {
  return useQuery({
    queryKey: ['content', section],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('section', section)
          .order('ordering', { ascending: true });
          
        if (error) {
          console.error(`Error fetching ${section} content:`, error);
          throw error;
        }
        
        return data as ContentItem[];
      } catch (err) {
        console.error(`Unexpected error fetching ${section} content:`, err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newContent: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('content')
          .insert(newContent)
          .select()
          .single();
          
        if (error) {
          console.error('Error creating content:', error);
          throw error;
        }
        
        return data as ContentItem;
      } catch (err) {
        console.error('Unexpected error creating content:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content', data.section] });
    },
    onError: (error) => {
      console.error('Error in content creation mutation:', error);
      toast.error('Failed to create content. Please try again.');
    }
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ContentItem> }) => {
      try {
        const { data, error } = await supabase
          .from('content')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
          
        if (error) {
          console.error(`Error updating content ${id}:`, error);
          throw error;
        }
        
        return data as ContentItem;
      } catch (err) {
        console.error('Unexpected error updating content:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content', data.section] });
    },
    onError: (error) => {
      console.error('Error in content update mutation:', error);
      toast.error('Failed to update content. Please try again.');
    }
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // First, get the content item to know its section
        const { data: contentItem, error: fetchError } = await supabase
          .from('content')
          .select('section')
          .eq('id', id)
          .single();
          
        if (fetchError) {
          console.error(`Error fetching content ${id} before deletion:`, fetchError);
          throw fetchError;
        }
        
        const section = contentItem.section;
        
        // Now delete the content
        const { error: deleteError } = await supabase
          .from('content')
          .delete()
          .eq('id', id);
          
        if (deleteError) {
          console.error(`Error deleting content ${id}:`, deleteError);
          throw deleteError;
        }
        
        return { id, section };
      } catch (err) {
        console.error('Unexpected error deleting content:', err);
        throw err;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content', data.section] });
    },
    onError: (error) => {
      console.error('Error in content deletion mutation:', error);
      toast.error('Failed to delete content. Please try again.');
    }
  });
};

// Utility hook to get content from all sections
export const useAllContent = () => {
  return useQuery({
    queryKey: ['content', 'all'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .order('section')
          .order('ordering', { ascending: true });
          
        if (error) {
          console.error('Error fetching all content:', error);
          throw error;
        }
        
        return data as ContentItem[];
      } catch (err) {
        console.error('Unexpected error fetching all content:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000
  });
};
