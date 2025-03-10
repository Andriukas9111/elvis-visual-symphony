
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('section', section)
        .order('ordering', { ascending: true });
        
      if (error) throw error;
      return data as ContentItem[];
    }
  });
};

export const useCreateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newContent: Omit<ContentItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content')
        .insert(newContent)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content', data.section] });
    }
  });
};

export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ContentItem> }) => {
      const { data, error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content', data.section] });
    }
  });
};

export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('content')
        .delete()
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content', data.section] });
    }
  });
};
