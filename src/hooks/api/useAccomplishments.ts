
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Accomplishment {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
  icon_name?: string;
  sort_order: number;
}

export const useAccomplishments = () => {
  return useQuery({
    queryKey: ['accomplishments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accomplishments')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as Accomplishment[];
    }
  });
};

export const useCreateAccomplishment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newAccomplishment: Omit<Accomplishment, 'id'>) => {
      const { data, error } = await supabase
        .from('accomplishments')
        .insert(newAccomplishment)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    }
  });
};

export const useUpdateAccomplishment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Accomplishment> }) => {
      const { data, error } = await supabase
        .from('accomplishments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    }
  });
};

export const useDeleteAccomplishment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accomplishments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accomplishments'] });
    }
  });
};
