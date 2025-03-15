
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables, Insertable, Updatable } from '@/types/supabase';
import { toast } from 'sonner';

// Define and export the StatItem interface 
export interface StatItem {
  id: string;
  label: string;
  value: number;
  icon_name: string;
  suffix: string;
  sort_order?: number;
  tab?: string;
  ordering?: number;
}

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
      
      return data as StatItem[];
    },
  });
};

// Create a new stat
export const useCreateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newStat: Omit<StatItem, 'id'>) => {
      const { data, error } = await supabase
        .from('stats')
        .insert(newStat)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating stat:', error);
        throw error;
      }
      
      return data as StatItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error creating stat:', error);
      toast.error('Failed to create stat');
    }
  });
};

// Update a stat
export const useUpdateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StatItem> }) => {
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
      
      return data as StatItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error updating stat:', error);
      toast.error('Failed to update stat');
    }
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
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error deleting stat:', error);
      toast.error('Failed to delete stat');
    }
  });
};

// Reorder stats
export const useReorderStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (stats: StatItem[]) => {
      // Update sort order for all stats
      const updates = stats.map((stat, index) => ({
        id: stat.id,
        sort_order: index
      }));
      
      // Execute all updates
      const promises = updates.map(update => 
        supabase
          .from('stats')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      );
      
      await Promise.all(promises);
      return stats;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
    onError: (error) => {
      console.error('Error reordering stats:', error);
      toast.error('Failed to reorder stats');
    }
  });
};
