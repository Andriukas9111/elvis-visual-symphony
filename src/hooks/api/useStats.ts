
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type StatItem = {
  id: string;
  icon_name: string;
  value: number;
  suffix: string;
  label: string;
  sort_order: number;
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as StatItem[];
    }
  });
};

export const useUpdateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<StatItem> }) => {
      const { data, error } = await supabase
        .from('stats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });
};

export const useCreateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newStat: Omit<StatItem, 'id'>) => {
      const { data, error } = await supabase
        .from('stats')
        .insert(newStat)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });
};

export const useDeleteStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stats')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });
};
