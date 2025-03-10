
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type ExpertiseItem = {
  id: string;
  icon_name: string;
  label: string;
  description: string;
  type: 'expertise' | 'project';
  sort_order: number;
};

export const useExpertise = (type?: 'expertise' | 'project') => {
  return useQuery({
    queryKey: ['expertise', type],
    queryFn: async () => {
      let query = supabase
        .from('expertise')
        .select('*');
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query.order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as ExpertiseItem[];
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

export const useCreateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newExpertise: Omit<ExpertiseItem, 'id'>) => {
      const { data, error } = await supabase
        .from('expertise')
        .insert(newExpertise)
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
