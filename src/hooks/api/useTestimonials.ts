
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/components/home/about/types';

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      console.log('Fetching testimonials from Supabase');
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false });
        
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
      
      console.log('Testimonials fetched:', data);
      return data as Testimonial[];
    },
    // Ensure the data is kept fresh by refetching when needed
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true
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
