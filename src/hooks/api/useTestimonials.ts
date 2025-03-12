
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/components/home/about/types';

type TestimonialInput = Omit<Testimonial, 'id'>;

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('sort_order', { ascending: true });
          
        if (error) {
          console.error('Error fetching testimonials:', error);
          return [];
        }
        
        // Map database results to match Testimonial type
        const testimonials = data?.map(item => ({
          id: item.id,
          name: item.client_name,
          position: item.client_title,
          company: item.client_company || '',
          quote: item.content,
          avatar: item.avatar_url,
          is_featured: item.is_featured || false,
          created_at: item.created_at
        })) || [];
        
        return testimonials;
      } catch (err) {
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
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<TestimonialInput> }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update({
          client_name: updates.name,
          client_title: updates.position,
          client_company: updates.company,
          content: updates.quote,
          avatar_url: updates.avatar,
          is_featured: updates.is_featured
        })
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
    mutationFn: async (newTestimonial: TestimonialInput) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          client_name: newTestimonial.name,
          client_title: newTestimonial.position,
          client_company: newTestimonial.company,
          content: newTestimonial.quote,
          avatar_url: newTestimonial.avatar,
          is_featured: newTestimonial.is_featured
        })
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
