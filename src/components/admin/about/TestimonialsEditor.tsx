
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import useTestimonials from './testimonials/useTestimonials';
import TestimonialForm from './testimonials/TestimonialForm';
import TestimonialsList from './testimonials/TestimonialsList';
import { TestimonialFormData } from './testimonials/types';
import { useToast } from '@/components/ui/use-toast';

export const TestimonialsEditor: React.FC = () => {
  const { toast } = useToast();
  
  const {
    testimonials,
    paginatedTestimonials,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    isEditing,
    reordering,
    setReordering,
    saveTestimonial,
    handleEdit,
    handleDelete,
    resetForm,
    moveTestimonial,
    updateTestimonialFeatured,
  } = useTestimonials();

  const form = useForm<TestimonialFormData>({
    defaultValues: {
      name: '',
      role: '',
      content: '',
      avatar_url: ''
    }
  });
  
  const { setValue, watch, reset } = form;
  const contentValue = watch('content', '');
  
  const onEdit = (testimonial: any) => {
    try {
      console.log('Editing testimonial:', testimonial);
      const formData = handleEdit(testimonial);
      setValue('name', formData.name);
      setValue('role', formData.role);
      setValue('content', formData.content);
      setValue('avatar_url', formData.avatar_url || '');
    } catch (error) {
      console.error('Error setting form values for edit:', error);
      toast({
        title: 'Error',
        description: 'Could not load testimonial for editing',
        variant: 'destructive'
      });
    }
  };

  const handleSaveTestimonial = async (data: TestimonialFormData) => {
    try {
      console.log('Saving testimonial:', data);
      await saveTestimonial(data);
      reset({
        name: '',
        role: '',
        content: '',
        avatar_url: ''
      });
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to save testimonial',
        variant: 'destructive'
      });
    }
  };

  const toggleReordering = () => {
    setReordering(!reordering);
  };

  return (
    <Card className="pt-6">
      <CardContent className="space-y-6">
        <TestimonialForm
          form={form}
          isEditing={isEditing}
          onSubmit={handleSaveTestimonial}
          onCancel={() => {
            resetForm();
            reset({
              name: '',
              role: '',
              content: '',
              avatar_url: ''
            });
          }}
          contentValue={contentValue}
        />
        
        <div className="space-y-4">
          <TestimonialsList
            testimonials={testimonials}
            paginatedTestimonials={paginatedTestimonials}
            isLoading={isLoading}
            reordering={reordering}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            onEdit={onEdit}
            onDelete={handleDelete}
            onMove={moveTestimonial}
            onUpdateFeatured={updateTestimonialFeatured}
            toggleReordering={toggleReordering}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsEditor;
