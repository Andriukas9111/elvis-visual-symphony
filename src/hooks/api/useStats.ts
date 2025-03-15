
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';

// Fetch all stats
export const useStats = (filter?: { tab?: string }) => {
  return useQuery({
    queryKey: ['stats', filter],
    queryFn: async () => {
      let query = supabase.from('stats').select('*').order('ordering', { ascending: true });
      
      if (filter?.tab) {
        // If tab filter is provided, apply it
        query = query.eq('tab', filter.tab);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }
      
      return data;
    },
  });
};

// Create a new stat
export const useCreateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newStat: Insertable<'stats'>) => {
      const { data, error } = await supabase
        .from('stats')
        .insert(newStat)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating stat:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

// Update a stat
export const useUpdateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Updatable<'stats'> }) => {
      const { data, error } = await supabase
        .from('stats')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating stat:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

// Delete a stat
export const useDeleteStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stats')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting stat:', error);
        throw error;
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};
