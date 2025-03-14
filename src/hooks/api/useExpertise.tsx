
import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from './queryClient';
import { ExpertiseItem } from '@/components/home/about/types';

// Export the ExpertiseItem interface from the types file
export { ExpertiseItem };

// Fetching expertise items
export const useExpertise = (options?: UseQueryOptions<ExpertiseItem[]>) => {
  return useQuery({
    queryKey: ['expertise'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expertise_items')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) {
        console.error('Error fetching expertise:', error);
        throw error;
      }
      
      // Map database fields to component expected fields
      return data.map(item => ({
        id: item.id,
        label: item.title, // Map database 'title' to component's 'label'
        description: item.description,
        icon_name: item.icon, // Map database 'icon' to component's 'icon_name'
        type: (item.type || 'expertise') as 'expertise' | 'project', // Ensure type is constrained
        background_color: item.background_color,
        sort_order: item.order_index
      })) as ExpertiseItem[];
    },
    ...options,
  });
};

// Fetching project types
export const useProjectTypes = (options?: UseQueryOptions<ExpertiseItem[]>) => {
  return useQuery({
    queryKey: ['project_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_types')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) {
        console.error('Error fetching project types:', error);
        throw error;
      }
      
      // Map database fields to component expected fields
      return data.map(item => ({
        id: item.id,
        label: item.title, // Map database 'title' to component's 'label'
        description: item.description,
        icon_name: item.icon, // Map database 'icon' to component's 'icon_name'
        type: 'project' as const, // Explicitly set as 'project' with const assertion
        background_color: item.background_color,
        sort_order: item.order_index
      })) as ExpertiseItem[];
    },
    ...options,
  });
};

// Add ExpertiseItem
export const useAddExpertise = () => {
  return useMutation({
    mutationFn: async (expertise: Omit<ExpertiseItem, 'id'>) => {
      // Convert from component fields to database fields
      const dbExpertise = {
        title: expertise.label, // Map component's 'label' to database 'title'
        description: expertise.description,
        icon: expertise.icon_name, // Map component's 'icon_name' to database 'icon'
        background_color: expertise.background_color || '#2A1E30',
        order_index: expertise.sort_order || 0,
        type: expertise.type // Already matches
      };
      
      const { data, error } = await supabase
        .from(expertise.type === 'project' ? 'project_types' : 'expertise_items')
        .insert(dbExpertise)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding expertise:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [variables.type === 'project' ? 'project_types' : 'expertise'] 
      });
      toast({
        title: `${variables.type === 'project' ? 'Project' : 'Expertise'} added`,
        description: `${variables.type === 'project' ? 'Project' : 'Expertise'} has been added successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add expertise',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Update ExpertiseItem
export const useUpdateExpertise = () => {
  return useMutation({
    mutationFn: async ({ id, type, updates }: { id: string; type: 'expertise' | 'project'; updates: Partial<ExpertiseItem> }) => {
      // Convert from component fields to database fields
      const dbUpdates: any = {};
      
      if (updates.label) dbUpdates.title = updates.label;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.icon_name) dbUpdates.icon = updates.icon_name;
      if (updates.background_color) dbUpdates.background_color = updates.background_color;
      if (updates.sort_order !== undefined) dbUpdates.order_index = updates.sort_order;
      
      const { data, error } = await supabase
        .from(type === 'project' ? 'project_types' : 'expertise_items')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating expertise:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [variables.type === 'project' ? 'project_types' : 'expertise'] 
      });
      toast({
        title: `${variables.type === 'project' ? 'Project' : 'Expertise'} updated`,
        description: `${variables.type === 'project' ? 'Project' : 'Expertise'} has been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update expertise',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Delete ExpertiseItem
export const useDeleteExpertise = () => {
  return useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'expertise' | 'project' }) => {
      const { error } = await supabase
        .from(type === 'project' ? 'project_types' : 'expertise_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting expertise:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [variables.type === 'project' ? 'project_types' : 'expertise'] 
      });
      toast({
        title: `${variables.type === 'project' ? 'Project' : 'Expertise'} deleted`,
        description: `${variables.type === 'project' ? 'Project' : 'Expertise'} has been deleted successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete expertise',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    },
  });
};
