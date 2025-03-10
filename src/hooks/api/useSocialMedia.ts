
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialPlatformData } from '@/components/home/about/types';

export const useSocialMedia = () => {
  return useQuery({
    queryKey: ['socialMedia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .order('sort_order', { ascending: true });
        
      if (error) throw error;
      
      // Map database format to component format
      return data.map(link => ({
        id: link.id,
        name: link.platform,
        url: link.url,
        icon: link.icon,
        color: link.color,
        sort_order: link.sort_order || 0
      })) as SocialPlatformData[];
    }
  });
};

export const useCreateSocialMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newLink: Omit<SocialPlatformData, 'id'>) => {
      const { data, error } = await supabase
        .from('social_media')
        .insert({
          platform: newLink.name,
          url: newLink.url,
          icon: newLink.icon,
          color: newLink.color,
          sort_order: newLink.sort_order || 0
        })
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
    mutationFn: async (link: SocialPlatformData) => {
      const { data, error } = await supabase
        .from('social_media')
        .update({
          platform: link.name,
          url: link.url,
          icon: link.icon,
          color: link.color,
          sort_order: link.sort_order || 0
        })
        .eq('id', link.id)
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
