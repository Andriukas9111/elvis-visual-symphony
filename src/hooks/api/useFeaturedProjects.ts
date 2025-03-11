
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type FeaturedProject = {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  video_url?: string;
  is_featured?: boolean;
  order_index?: number;
};

export const useFeaturedProjects = () => {
  return useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_projects')
        .select('*')
        .eq('is_featured', true)
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      return data as FeaturedProject[];
    }
  });
};

export const useCreateFeaturedProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProject: Omit<FeaturedProject, 'id'>) => {
      const { data, error } = await supabase
        .from('featured_projects')
        .insert(newProject)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-projects'] });
    }
  });
};

export const useUpdateFeaturedProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<FeaturedProject> }) => {
      const { data, error } = await supabase
        .from('featured_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-projects'] });
    }
  });
};

export const useDeleteFeaturedProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('featured_projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featured-projects'] });
    }
  });
};
