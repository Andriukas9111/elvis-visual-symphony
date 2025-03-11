
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

export interface TestimonialData {
  id: string;
  client_name: string;
  client_title: string;
  client_company?: string;
  client_image?: string;
  content: string;
  rating?: number;
  is_featured: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export const useTestimonials = () => {
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('order_index')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
      
      return (data || []) as TestimonialData[];
    }
  });

  const createTestimonial = useMutation({
    mutationFn: async (newTestimonial: Omit<TestimonialData, 'id'>) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([newTestimonial])
        .select();
      
      if (error) {
        console.error('Error creating testimonial:', error);
        throw error;
      }
      
      return data[0] as TestimonialData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial created successfully');
    },
    onError: (error) => {
      console.error('Error creating testimonial:', error);
      toast.error('Failed to create testimonial');
    }
  });

  const updateTestimonial = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TestimonialData> }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating testimonial:', error);
        throw error;
      }
      
      return data[0] as TestimonialData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully');
    },
    onError: (error) => {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  });

  const deleteTestimonial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update({ is_featured: isFeatured })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error updating testimonial featured status:', error);
        throw error;
      }
      
      return data[0] as TestimonialData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully');
    },
    onError: (error) => {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  });

  return {
    testimonials,
    isLoading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleFeatured
  };
};
