
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Expertise } from '@/types/about.types';

export const useExpertise = (category?: string) => {
  return useQuery({
    queryKey: ['expertise', category],
    queryFn: async () => {
      let query = supabase
        .from('expertise')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Expertise[];
    }
  });
};

export const useExpertiseById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['expertise-item', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('expertise')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Expertise;
    },
    enabled: !!id
  });
};

export const useCreateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: Omit<Expertise, 'id' | 'created_at' | 'updated_at'>) => {
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
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: Partial<Expertise>;
    }) => {
      const { data, error } = await supabase
        .from('expertise')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
      queryClient.invalidateQueries({ queryKey: ['expertise-item', variables.id] });
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

export const useReorderExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: { id: string; sort_order: number }[]) => {
      // Create a batch update
      const promises = items.map(({ id, sort_order }) => {
        return supabase
          .from('expertise')
          .update({ sort_order })
          .eq('id', id);
      });
      
      await Promise.all(promises);
      return items;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
    }
  });
};
