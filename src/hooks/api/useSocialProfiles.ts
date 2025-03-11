
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SocialProfile } from '@/types/about.types';

export const useSocialProfiles = () => {
  return useQuery({
    queryKey: ['social-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_profiles')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as SocialProfile[];
    }
  });
};

export const useSocialProfileById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['social-profile', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('social_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as SocialProfile;
    },
    enabled: !!id
  });
};

export const useCreateSocialProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProfile: Omit<SocialProfile, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('social_profiles')
        .insert(newProfile)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-profiles'] });
    }
  });
};

export const useUpdateSocialProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: Partial<SocialProfile>;
    }) => {
      const { data, error } = await supabase
        .from('social_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['social-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['social-profile', variables.id] });
    }
  });
};

export const useDeleteSocialProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('social_profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-profiles'] });
    }
  });
};

export const useReorderSocialProfiles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: { id: string; sort_order: number }[]) => {
      // Create a batch update
      const promises = items.map(({ id, sort_order }) => {
        return supabase
          .from('social_profiles')
          .update({ sort_order })
          .eq('id', id);
      });
      
      await Promise.all(promises);
      return items;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-profiles'] });
    }
  });
};
