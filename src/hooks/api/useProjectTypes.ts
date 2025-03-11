
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type ProjectType = {
  id: string;
  title: string;
  description: string;
  icon: string;
  background_color?: string;
  order_index?: number;
};

export const useProjectTypes = () => {
  return useQuery({
    queryKey: ['project-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_types')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      return data as ProjectType[];
    }
  });
};

export const useCreateProjectType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newType: Omit<ProjectType, 'id'>) => {
      const { data, error } = await supabase
        .from('project_types')
        .insert(newType)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-types'] });
    }
  });
};

export const useUpdateProjectType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ProjectType> }) => {
      const { data, error } = await supabase
        .from('project_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-types'] });
    }
  });
};

export const useDeleteProjectType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_types')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-types'] });
    }
  });
};
