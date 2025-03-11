
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
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 5;
  const { toast } = useToast();

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const paginatedTestimonials = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials...');
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index');
        
      if (error) {
        console.error('Error fetching testimonials:', error);
        setError(error.message);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} testimonials`);
      
      // Map the data from client_name, client_title, client_company, client_image to name, role, etc.
      const mappedData = (data || []).map(item => ({
        id: item.id,
        name: item.client_name || item.name,
        role: item.client_title || item.role || '', 
        company: item.client_company, 
        content: item.content,
        avatar_url: item.client_image || item.avatar_url,
        is_featured: item.is_featured,
        order_index: item.order_index
      }));
      
      setTestimonials(mappedData);
    } catch (error: any) {
      console.error('Error in fetchTestimonials:', error);
      toast({
        title: 'Error',
        description: `Failed to load testimonials: ${error.message}`,
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
      console.log('Saving testimonial:', data);
      setError(null);
      
      if (isEditing && selectedTestimonial) {
        console.log('Updating existing testimonial:', selectedTestimonial);
        
        // Check for the table structure - some implementations use client_name
        const { error: tableInfoError, data: tableInfo } = await supabase
          .from('testimonials')
          .select('*')
          .limit(1);
        
        if (tableInfoError) {
          console.error('Error checking table structure:', tableInfoError);
          throw tableInfoError;
        }
        
        // Determine field names based on existing data
        const columnsToUpdate: any = {};
        
        // Handle field name variations
        if ('client_name' in (tableInfo[0] || {})) {
          columnsToUpdate.client_name = data.name;
          columnsToUpdate.client_title = data.role;
          columnsToUpdate.client_image = data.avatar_url;
        } else {
          columnsToUpdate.name = data.name;
          columnsToUpdate.role = data.role;
          columnsToUpdate.avatar_url = data.avatar_url;
        }
        
        // Common fields
        columnsToUpdate.content = data.content;
        
        const { error } = await supabase
          .from('testimonials')
          .update(columnsToUpdate)
          .eq('id', selectedTestimonial);

        if (error) {
          console.error('Error updating testimonial:', error);
          throw error;
        }

        toast({
          title: 'Success',
          description: 'Testimonial updated successfully',
        });
      } else {
        console.log('Creating new testimonial');
        const newOrderIndex = testimonials.length > 0 
          ? Math.max(...testimonials.map(t => t.order_index || 0)) + 1 
          : 1;
        
        // Check for the table structure - some implementations use client_name
        const { error: tableInfoError, data: tableInfo } = await supabase
          .from('testimonials')
          .select('*')
          .limit(1);
        
        if (tableInfoError) {
          console.error('Error checking table structure:', tableInfoError);
          throw tableInfoError;
        }
        
        // Determine field names based on existing data
        let newTestimonial: any = {
          content: data.content,
          order_index: newOrderIndex,
          is_featured: true
        };
        
        // Handle field name variations
        if (tableInfo.length > 0 && 'client_name' in tableInfo[0]) {
          newTestimonial.client_name = data.name;
          newTestimonial.client_title = data.role;
          newTestimonial.client_image = data.avatar_url;
        } else {
          newTestimonial.name = data.name;
          newTestimonial.role = data.role;
          newTestimonial.avatar_url = data.avatar_url;
        }
        
        console.log('Creating new testimonial with data:', newTestimonial);

        const { error } = await supabase
          .from('testimonials')
          .insert([newTestimonial]);

        if (error) {
          console.error('Error creating testimonial:', error);
          throw error;
        }

        toast({
          title: 'Success',
          description: 'Testimonial added successfully',
        });
      }

      resetForm();
      fetchTestimonials();
    } catch (error: any) {
      console.error('Error in saveTestimonial:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: `Failed to save testimonial: ${error.message}`,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setIsEditing(true);
    setSelectedTestimonial(testimonial.id);
    return {
      name: testimonial.name,
      role: testimonial.role || '',
      content: testimonial.content,
      avatar_url: testimonial.avatar_url || '',
    };
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting testimonial:', id);
      setError(null);
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });

      fetchTestimonials();
    } catch (error: any) {
      console.error('Error in handleDelete:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: `Failed to delete testimonial: ${error.message}`,
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
      console.log('Updating order index:', id, newOrderIndex);
      setError(null);
      
      const { error } = await supabase
        .from('testimonials')
        .update({ order_index: newOrderIndex })
        .eq('id', id);

      if (error) {
        console.error('Error updating order:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Error in updateOrderIndex:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: `Failed to update testimonial order: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const moveTestimonial = async (id: string, direction: 'up' | 'down') => {
    try {
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
    } catch (error: any) {
      console.error('Error in moveTestimonial:', error);
      setError(error.message);
    }
  };

  const updateTestimonialFeatured = async (id: string, isFeatured: boolean) => {
    try {
      console.log('Updating testimonial featured status:', id, isFeatured);
      setError(null);
      
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: isFeatured })
        .eq('id', id);

      if (error) {
        console.error('Error updating featured status:', error);
        throw error;
      }

      toast({
        title: 'Success',
        description: `Testimonial ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
      });

      fetchTestimonials();
    } catch (error: any) {
      console.error('Error in updateTestimonialFeatured:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: `Failed to update testimonial status: ${error.message}`,
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
    error,
    saveTestimonial,
    handleEdit,
    handleDelete,
    resetForm,
    moveTestimonial,
    updateTestimonialFeatured,
  };
};

export default useTestimonials;
