
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/components/home/about/types';

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Testimonial[];
    }
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTestimonial: Omit<Testimonial, 'id'>) => {
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
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Testimonial> }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
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
