
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { logError } from '@/utils/errorLogger';

export type StatItem = {
  id: string;
  icon_name: string;
  value: number;
  suffix: string;
  label: string;
  sort_order: number;
  tab?: string;
  description?: string;
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('stats')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (error) {
          logError(error, {
            context: 'useStats',
            level: 'error',
            additionalData: { query: 'select stats' }
          });
          console.error('Error fetching stats:', error);
          return [];
        }
        
        // If there's no data or empty data, return default stats
        if (!data || data.length === 0) {
          // Create default stats if none exist
          return [
            // Social Stats (4)
            { id: '1', icon_name: 'Camera', value: 8, suffix: '+', label: 'Projects', sort_order: 0 },
            { id: '2', icon_name: 'Video', value: 100, suffix: '+', label: 'Projects filmed & edited', sort_order: 1 },
            { id: '3', icon_name: 'Users', value: 37, suffix: 'K+', label: 'Followers', sort_order: 2 },
            { id: '4', icon_name: 'Eye', value: 10, suffix: 'M+', label: 'Views across social media', sort_order: 3 },
            
            // Videography Stats
            { id: '5', icon_name: 'Film', value: 250, suffix: '+', label: 'Videos Created', sort_order: 4, tab: 'videography' },
            { id: '6', icon_name: 'Clock', value: 5000, suffix: '+', label: 'Hours of Footage', sort_order: 5, tab: 'videography' },
            { id: '7', icon_name: 'Award', value: 12, suffix: '+', label: 'Video Awards', sort_order: 6, tab: 'videography' },
            { id: '8', icon_name: 'Users', value: 85, suffix: '+', label: 'Client Projects', sort_order: 7, tab: 'videography' },
            
            // Photography Stats
            { id: '9', icon_name: 'Camera', value: 10000, suffix: '+', label: 'Photos Taken', sort_order: 8, tab: 'photography' },
            { id: '10', icon_name: 'Image', value: 1500, suffix: '+', label: 'Portraits Shot', sort_order: 9, tab: 'photography' },
            { id: '11', icon_name: 'Calendar', value: 120, suffix: '+', label: 'Photo Sessions', sort_order: 10, tab: 'photography' },
            { id: '12', icon_name: 'Star', value: 95, suffix: '%', label: 'Client Satisfaction', sort_order: 11, tab: 'photography' },
            
            // Editing Stats
            { id: '13', icon_name: 'Edit', value: 300, suffix: '+', label: 'Projects Edited', sort_order: 12, tab: 'editing' },
            { id: '14', icon_name: 'Clock', value: 8000, suffix: '+', label: 'Hours of Editing', sort_order: 13, tab: 'editing' },
            { id: '15', icon_name: 'CheckCircle', value: 200, suffix: '+', label: 'Color Grades', sort_order: 14, tab: 'editing' },
            { id: '16', icon_name: 'Calendar', value: 7, suffix: '+', label: 'Years Experience', sort_order: 15, tab: 'editing' },
            
            // Accomplishments (6)
            { id: '17', icon_name: 'CheckCircle', value: 300, suffix: '+', label: 'Projects Completed', sort_order: 16 },
            { id: '18', icon_name: 'Award', value: 15, suffix: '+', label: 'Awards Won', sort_order: 17 },
            { id: '19', icon_name: 'Calendar', value: 8, suffix: '+', label: 'Years Experience', sort_order: 18 },
            { id: '20', icon_name: 'Trophy', value: 20, suffix: '+', label: 'Competitions Won', sort_order: 19 },
            { id: '21', icon_name: 'Star', value: 96, suffix: '%', label: 'Client Satisfaction', sort_order: 20 },
            { id: '22', icon_name: 'Clock', value: 500, suffix: '+', label: 'Hours of Editing', sort_order: 21 }
          ];
        }
        
        return data as StatItem[];
      } catch (err) {
        logError(err instanceof Error ? err : new Error(String(err)), {
          context: 'useStats',
          level: 'error',
          additionalData: { query: 'select stats' }
        });
        console.error('Unexpected error fetching stats:', err);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
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
