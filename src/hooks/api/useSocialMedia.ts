
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialMedia } from '@/components/home/about/types';

export const useSocialMedia = () => {
  return useQuery({
    queryKey: ['socialMedia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as SocialMedia[];
    }
  });
};

export const useCreateSocialMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newItem: Omit<SocialMedia, 'id'>) => {
      const { data, error } = await supabase
        .from('social_media')
        .insert(newItem)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMedia'] });
    }
  });
};

export const useUpdateSocialMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<SocialMedia> }) => {
      const { data, error } = await supabase
        .from('social_media')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMedia'] });
    }
  });
};

export const useDeleteSocialMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_media')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialMedia'] });
    }
  });
};
