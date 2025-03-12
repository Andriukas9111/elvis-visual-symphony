import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialPlatformData } from '@/components/home/about/types';
import { toast } from 'sonner';

export const useSocialMedia = () => {
  return useQuery({
    queryKey: ['social-media'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('social_platforms')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (error) {
          console.error('Error fetching social platforms:', error);
          return [];
        }
        
        return data as SocialPlatformData[];
      } catch (err) {
        console.error('Unexpected error fetching social platforms:', err);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
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
