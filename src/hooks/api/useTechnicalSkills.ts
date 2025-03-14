
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface TechnicalSkillItem {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  skills: string[];
  icon_name: string;
  description?: string;
  sort_order: number;
}

export const useTechnicalSkills = () => {
  return useQuery({
    queryKey: ['technicalSkills'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('technical_skills')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (error) {
          console.error('Error fetching technical skills:', error);
          throw error;
        }
        
        return data as TechnicalSkillItem[];
      } catch (err) {
        console.error('Failed to fetch technical skills:', err);
        return [];
      }
    }
  });
};

export const useCreateTechnicalSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newSkill: Omit<TechnicalSkillItem, 'id'>) => {
      const { data, error } = await supabase
        .from('technical_skills')
        .insert(newSkill)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicalSkills'] });
      toast.success('Technical skill created successfully');
    },
    onError: (error) => {
      console.error('Error creating technical skill:', error);
      toast.error('Failed to create technical skill');
    }
  });
};

export const useUpdateTechnicalSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<TechnicalSkillItem> }) => {
      const { data, error } = await supabase
        .from('technical_skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicalSkills'] });
      toast.success('Technical skill updated successfully');
    },
    onError: (error) => {
      console.error('Error updating technical skill:', error);
      toast.error('Failed to update technical skill');
    }
  });
};

export const useDeleteTechnicalSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('technical_skills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicalSkills'] });
      toast.success('Technical skill deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting technical skill:', error);
      toast.error('Failed to delete technical skill');
    }
  });
};
