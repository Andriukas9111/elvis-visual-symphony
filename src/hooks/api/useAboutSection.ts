
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AboutSectionData } from '@/types/about.types';

export const useAboutSections = () => {
  return useQuery({
    queryKey: ['about-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as AboutSectionData[];
    }
  });
};

export const useAboutSectionById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['about-section', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as AboutSectionData;
    },
    enabled: !!id
  });
};

export const useCreateAboutSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newSection: Omit<AboutSectionData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('about_sections')
        .insert(newSection)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
    }
  });
};

export const useUpdateAboutSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: Partial<AboutSectionData>;
    }) => {
      const { data, error } = await supabase
        .from('about_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
      queryClient.invalidateQueries({ queryKey: ['about-section', variables.id] });
    }
  });
};

export const useDeleteAboutSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('about_sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-sections'] });
    }
  });
};
