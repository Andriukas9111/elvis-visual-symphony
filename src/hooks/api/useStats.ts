import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { logError } from '@/utils/errorLogger';

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
      try {
        let query = supabase.from('stats').select('*').order('sort_order', { ascending: true });
        
        if (filter?.tab) {
          // If tab filter is provided, apply it
          query = query.eq('tab', filter.tab);
        }
        
        const { data, error } = await query;
        
        if (error) {
          logError(error, { context: 'useStats', level: 'error' });
          throw error;
        }
        
        return data as StatItem[];
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Unknown error in useStats'), 
                { context: 'useStats', level: 'error' });
        throw error;
      }
    },
    refetchOnWindowFocus: false
  });
};

// Create a new stat
export const useCreateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newStat: Omit<StatItem, 'id'>) => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .insert(newStat)
          .select()
          .single();
        
        if (error) {
          logError(error, { context: 'useCreateStat', level: 'error' });
          throw error;
        }
        
        return data as StatItem;
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Unknown error in useCreateStat'), 
                { context: 'useCreateStat', level: 'error' });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Stat created successfully');
    },
    onError: (error) => {
      logError(error, { context: 'useCreateStat', level: 'error' });
      toast.error('Failed to create stat');
    }
  });
};

// Update a stat
export const useUpdateStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<StatItem> }) => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          logError(error, { context: 'useUpdateStat', level: 'error' });
          throw error;
        }
        
        return data as StatItem;
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Unknown error in useUpdateStat'), 
                { context: 'useUpdateStat', level: 'error' });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Stat updated successfully');
    },
    onError: (error) => {
      logError(error, { context: 'useUpdateStat', level: 'error' });
      toast.error('Failed to update stat');
    }
  });
};

// Delete a stat
export const useDeleteStat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('stats')
          .delete()
          .eq('id', id);
        
        if (error) {
          logError(error, { context: 'useDeleteStat', level: 'error' });
          throw error;
        }
        
        return id;
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Unknown error in useDeleteStat'), 
                { context: 'useDeleteStat', level: 'error' });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Stat deleted successfully');
    },
    onError: (error) => {
      logError(error, { context: 'useDeleteStat', level: 'error' });
      toast.error('Failed to delete stat');
    }
  });
};

// Reorder stats
export const useReorderStats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (stats: StatItem[]) => {
      try {
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
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Unknown error in useReorderStats'), 
                { context: 'useReorderStats', level: 'error' });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Stats reordered successfully');
    },
    onError: (error) => {
      logError(error, { context: 'useReorderStats', level: 'error' });
      toast.error('Failed to reorder stats');
    }
  });
};
