
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TestimonialData } from '@/components/home/about/types';

export const useTestimonials = (featuredOnly: boolean = false) => {
  return useQuery({
    queryKey: ['testimonials', { featuredOnly }],
    queryFn: async () => {
      let query = supabase
        .from('testimonials')
        .select('*');
        
      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }
      
      const { data, error } = await query.order('order_index', { ascending: true });
        
      if (error) throw error;
      return data as TestimonialData[];
    }
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTestimonial: Omit<TestimonialData, 'id'>) => {
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
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<TestimonialData> }) => {
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
