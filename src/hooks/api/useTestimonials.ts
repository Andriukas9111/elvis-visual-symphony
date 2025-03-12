
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { logError } from '@/utils/errorLogger';

export type TestimonialItem = {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  featured?: boolean;
  sort_order?: number;
};

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        // Try to get testimonials from the database if the table exists
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (error) {
          // Log the error but don't throw it - allow the app to use fallback data
          console.error('Error fetching testimonials:', error);
          return [];
        }
        
        return data as TestimonialItem[];
      } catch (err) {
        // Log the error but don't throw it - allow the app to use fallback data
        console.error('Unexpected error fetching testimonials:', err);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<TestimonialItem> }) => {
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

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTestimonial: Omit<TestimonialItem, 'id'>) => {
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
