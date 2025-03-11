
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TechnicalSkillData } from '@/components/home/about/types';

export const useTechnicalSkills = () => {
  return useQuery({
    queryKey: ['technicalSkills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .order('category', { ascending: true });
        
      if (error) throw error;
      return data as TechnicalSkillData[];
    }
  });
};

export const useCreateTechnicalSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newSkill: Omit<TechnicalSkillData, 'id'>) => {
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
    }
  });
};

export const useUpdateTechnicalSkill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<TechnicalSkillData> }) => {
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
    }
  });
};
