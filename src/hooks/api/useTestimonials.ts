
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Testimonial {
  id: string;
  client_name: string;
  role?: string;
  client_company?: string;
  client_image?: string;
  content: string;
  rating?: number;
  is_featured: boolean;
  avatar_url?: string;
  order_index?: number;
}

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
      
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
      toast.success('Testimonial created successfully');
    },
    onError: (error) => {
      console.error('Error creating testimonial:', error);
      toast.error('Failed to create testimonial');
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
      toast.success('Testimonial updated successfully');
    },
    onError: (error) => {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
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
      toast.success('Testimonial deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  });
};
