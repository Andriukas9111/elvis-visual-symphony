
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type ExpertiseItem = {
  id: string;
  type: 'expertise' | 'project';
  icon_name: string;
  label: string;
  description: string;
  sort_order: number;
};

export const useExpertise = () => {
  return useQuery({
    queryKey: ['expertise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as ExpertiseItem[];
    }
  });
};

export const useCreateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: Omit<ExpertiseItem, 'id'>) => {
      const { data, error } = await supabase
        .from('expertise')
        .insert(newItem)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
    }
  });
};

export const useUpdateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ExpertiseItem> }) => {
      const { data, error } = await supabase
        .from('expertise')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
    }
  });
};

export const useDeleteExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expertise')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
    }
  });
};
