
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Statistic } from '@/types/about.types';

export const useStatistics = (category?: string) => {
  return useQuery({
    queryKey: ['statistics', category],
    queryFn: async () => {
      let query = supabase
        .from('statistics')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Statistic[];
    }
  });
};

export const useStatisticById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['statistic', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('statistics')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Statistic;
    },
    enabled: !!id
  });
};

export const useCreateStatistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newStatistic: Omit<Statistic, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('statistics')
        .insert(newStatistic)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
};

export const useUpdateStatistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: Partial<Statistic>;
    }) => {
      const { data, error } = await supabase
        .from('statistics')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      queryClient.invalidateQueries({ queryKey: ['statistic', variables.id] });
    }
  });
};

export const useDeleteStatistic = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('statistics')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
};

export const useReorderStatistics = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: { id: string; sort_order: number }[]) => {
      // Create a batch update
      const promises = items.map(({ id, sort_order }) => {
        return supabase
          .from('statistics')
          .update({ sort_order })
          .eq('id', id);
      });
      
      await Promise.all(promises);
      return items;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
};
