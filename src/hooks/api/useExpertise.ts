
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'expertise' | 'project';
  background_color?: string;
  sort_order?: number;
}

export const useExpertise = () => {
  return useQuery({
    queryKey: ['expertise'],
    queryFn: async () => {
      try {
        // First try to get expertise from database
        const { data: expertiseData, error: expertiseError } = await supabase
          .from('expertise')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (expertiseError) throw expertiseError;
        
        // Transform expertise data to match expected format
        const expertise = expertiseData.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          icon: item.icon || 'Briefcase',
          background_color: '#2A1E30',
          type: 'expertise' as const,
          sort_order: item.sort_order
        }));
        
        // Then get project types
        const { data: projectData, error: projectError } = await supabase
          .from('project_types')
          .select('*')
          .order('sort_order', { ascending: true });
        
        if (projectError) throw projectError;
        
        // Transform project data
        const projects = projectData.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          icon: item.icon || 'Film',
          background_color: item.background_color || '#2A1E30',
          type: 'project' as const,
          sort_order: item.sort_order
        }));
        
        // Combine and return
        return [...expertise, ...projects] as ExpertiseItem[];
      } catch (error) {
        console.error('Error fetching expertise:', error);
        
        // Return hardcoded fallback data if database fetch fails
        return [
          {
            id: '1',
            title: 'Commercial Videography',
            description: 'Creating compelling video content for brands and businesses',
            icon: 'Briefcase',
            type: 'expertise',
            sort_order: 1
          },
          {
            id: '2',
            title: 'Documentary Filmmaking',
            description: 'Telling powerful stories through documentary-style videos',
            icon: 'Film',
            type: 'expertise',
            sort_order: 2
          },
          {
            id: '3', 
            title: 'Brand Campaign',
            description: 'Full video campaigns for product launches including social media shorts',
            icon: 'Briefcase',
            type: 'project',
            sort_order: 3
          },
          {
            id: '4',
            title: 'Documentary Series',
            description: 'In-depth documentary series exploring various themes and subjects',
            icon: 'Film',
            type: 'project',
            sort_order: 4
          }
        ];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newExpertise: Omit<ExpertiseItem, 'id'>) => {
      // Determine which table to insert into based on type
      const table = newExpertise.type === 'expertise' ? 'expertise' : 'project_types';
      
      // Create record object based on table structure
      const record = {
        title: newExpertise.title,
        description: newExpertise.description,
        icon: newExpertise.icon,
        sort_order: newExpertise.sort_order || 0,
        background_color: newExpertise.background_color
      };
      
      const { data, error } = await supabase
        .from(table)
        .insert(record)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
      toast.success('Item created successfully');
    },
    onError: (error) => {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
    }
  });
};

export const useUpdateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates, type }: { id: string, updates: Partial<Omit<ExpertiseItem, 'id' | 'type'>>, type: 'expertise' | 'project' }) => {
      // Determine which table to update based on type
      const table = type === 'expertise' ? 'expertise' : 'project_types';
      
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
      toast.success('Item updated successfully');
    },
    onError: (error) => {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  });
};

export const useDeleteExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, type }: { id: string, type: 'expertise' | 'project' }) => {
      // Determine which table to delete from based on type
      const table = type === 'expertise' ? 'expertise' : 'project_types';
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expertise'] });
      toast.success('Item deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  });
};
