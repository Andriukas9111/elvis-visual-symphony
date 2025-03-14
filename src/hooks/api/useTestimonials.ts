
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Testimonial } from '@/components/home/about/types';

// Internal database structure
export interface TestimonialDB {
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

// Helper function to map database structure to UI structure
const mapTestimonialForUI = (data: TestimonialDB): Testimonial => {
  return {
    ...data,
    name: data.client_name,
    position: data.role?.split(',')[0]?.trim() || '',
    company: data.client_company || data.role?.split(',')[1]?.trim() || '',
    quote: data.content,
    avatar: data.avatar_url || data.client_image,
  };
};

// Helper function to map UI structure to database structure
const mapTestimonialForDB = (data: Partial<Testimonial>): Partial<TestimonialDB> => {
  return {
    client_name: data.name || data.client_name,
    role: data.position,
    client_company: data.company || data.client_company,
    content: data.quote || data.content,
    avatar_url: data.avatar || data.avatar_url,
    is_featured: data.is_featured,
    rating: data.rating
  };
};

// Get all testimonials
const getTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
  
  return (data || []).map(mapTestimonialForUI);
};

// Hook to get testimonials
export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials
  });
};

// Get featured testimonials only
const getFeaturedTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching featured testimonials:', error);
    throw error;
  }
  
  return (data || []).map(mapTestimonialForUI);
};

// Hook to get featured testimonials
export const useFeaturedTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: getFeaturedTestimonials
  });
};

// Create a new testimonial
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTestimonial: Omit<Testimonial, 'id'>) => {
      const dbTestimonial = mapTestimonialForDB(newTestimonial);
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert(dbTestimonial)
        .select()
        .single();
      
      if (error) throw error;
      return mapTestimonialForUI(data);
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

// Update an existing testimonial
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Testimonial> }) => {
      const dbUpdates = mapTestimonialForDB(updates);
      
      const { data, error } = await supabase
        .from('testimonials')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return mapTestimonialForUI(data);
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

// Delete a testimonial
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
