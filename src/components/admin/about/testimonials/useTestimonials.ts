
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Testimonial, TestimonialFormData } from './types';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reordering, setReordering] = useState(false);
  
  const itemsPerPage = 5;
  const { toast } = useToast();

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const paginatedTestimonials = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: 'Error',
        description: 'Failed to load testimonials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const saveTestimonial = async (data: TestimonialFormData) => {
    try {
      if (isEditing && selectedTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: data.name,
            role: data.role,
            content: data.content,
            avatar_url: data.avatar_url,
          })
          .eq('id', selectedTestimonial);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Testimonial updated successfully',
        });
      } else {
        const newTestimonial = {
          ...data,
          order_index: (testimonials.length + 1),
          is_featured: true
        };

        const { error } = await supabase
          .from('testimonials')
          .insert([newTestimonial]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Testimonial added successfully',
        });
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to save testimonial',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setIsEditing(true);
    setSelectedTestimonial(testimonial.id);
    return {
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      avatar_url: testimonial.avatar_url || '',
    };
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedTestimonial(null);
  };

  const updateOrderIndex = async (id: string, newOrderIndex: number) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ order_index: newOrderIndex })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update testimonial order',
        variant: 'destructive',
      });
    }
  };

  const moveTestimonial = async (id: string, direction: 'up' | 'down') => {
    const testimonialIndex = testimonials.findIndex(t => t.id === id);
    if (
      (direction === 'up' && testimonialIndex === 0) ||
      (direction === 'down' && testimonialIndex === testimonials.length - 1)
    ) {
      return;
    }

    const newTestimonials = [...testimonials];
    const swapIndex = direction === 'up' ? testimonialIndex - 1 : testimonialIndex + 1;

    const currentOrderIndex = newTestimonials[testimonialIndex].order_index;
    const swapOrderIndex = newTestimonials[swapIndex].order_index;

    await updateOrderIndex(newTestimonials[testimonialIndex].id, swapOrderIndex);
    await updateOrderIndex(newTestimonials[swapIndex].id, currentOrderIndex);

    [newTestimonials[testimonialIndex], newTestimonials[swapIndex]] = 
    [newTestimonials[swapIndex], newTestimonials[testimonialIndex]];

    setTestimonials(newTestimonials);
  };

  const updateTestimonialFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: isFeatured })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Testimonial ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      });

      fetchTestimonials();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update testimonial status',
        variant: 'destructive',
      });
    }
  };

  return {
    testimonials,
    paginatedTestimonials,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedTestimonial,
    isEditing,
    reordering,
    setReordering,
    saveTestimonial,
    handleEdit,
    handleDelete,
    resetForm,
    moveTestimonial,
    updateTestimonialFeatured,
  };
};

export default useTestimonials;
