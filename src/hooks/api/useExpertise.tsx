
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type ExpertiseItem = {
  id: string;
  label: string;
  description: string;
  icon_name: string;
  type: string;
  sort_order: number;
};

const getExpertise = async (type: string): Promise<ExpertiseItem[]> => {
  const { data, error } = await supabase
    .from('expertise')
    .select('*')
    .eq('type', type)
    .order('sort_order', { ascending: true });
  
  if (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
  
  return data || [];
};

export const useExpertise = (type: string) => {
  return useQuery({
    queryKey: ['expertise', type],
    queryFn: () => getExpertise(type)
  });
};

export const useCreateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: Omit<ExpertiseItem, 'id'>) => {
      const { data, error } = await supabase
        .from('expertise')
        .insert(newItem)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expertise', variables.type] });
      toast.success(`${variables.type === 'expertise' ? 'Expertise' : 'Project type'} created successfully`);
    },
    onError: (error) => {
      console.error('Error creating expertise item:', error);
      toast.error('Failed to create item');
    }
  });
};

export const useUpdateExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ExpertiseItem> }) => {
      const { data, error } = await supabase
        .from('expertise')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expertise', data.type] });
      toast.success(`${data.type === 'expertise' ? 'Expertise' : 'Project type'} updated successfully`);
    },
    onError: (error) => {
      console.error('Error updating expertise item:', error);
      toast.error('Failed to update item');
    }
  });
};

export const useDeleteExpertise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, type }: { id: string, type: string }) => {
      const { error } = await supabase
        .from('expertise')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { id, type };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expertise', data.type] });
      toast.success(`${data.type === 'expertise' ? 'Expertise' : 'Project type'} deleted successfully`);
    },
    onError: (error) => {
      console.error('Error deleting expertise item:', error);
      toast.error('Failed to delete item');
    }
  });
};
