
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/types/about.types';

export const useTestimonials = (limit?: number) => {
  return useQuery({
    queryKey: ['testimonials', { limit }],
    queryFn: async () => {
      let query = supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Testimonial[];
    }
  });
};

export const useTestimonialById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['testimonial', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Testimonial;
    },
    enabled: !!id
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTestimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert(newTestimonial)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      updates
    }: {
      id: string;
      updates: Partial<Testimonial>;
    }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', variables.id] });
    }
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });
};

export const useReorderTestimonials = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: { id: string; sort_order: number }[]) => {
      // Create a batch update
      const promises = items.map(({ id, sort_order }) => {
        return supabase
          .from('testimonials')
          .update({ sort_order })
          .eq('id', id);
      });
      
      await Promise.all(promises);
      return items;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    }
  });
};
