
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialPlatformData } from '@/types/admin';

export const useSocialMedia = () => {
  return useQuery({
    queryKey: ['social-media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_platforms')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      return data as SocialPlatformData[];
    }
  });
};

export const useUpdateSocialPlatform = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<SocialPlatformData> }) => {
      const { data, error } = await supabase
        .from('social_platforms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media'] });
    }
  });
};

export const useCreateSocialPlatform = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPlatform: Omit<SocialPlatformData, 'id'>) => {
      const { data, error } = await supabase
        .from('social_platforms')
        .insert(newPlatform)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media'] });
    }
  });
};

export const useDeleteSocialPlatform = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_platforms')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media'] });
    }
  });
};
