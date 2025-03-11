
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import useTestimonials from './testimonials/useTestimonials';
import TestimonialForm from './testimonials/TestimonialForm';
import TestimonialsList from './testimonials/TestimonialsList';
import { TestimonialFormData } from './testimonials/types';

export const TestimonialsEditor: React.FC = () => {
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

  const form = useForm<TestimonialFormData>();
  const { setValue, watch, reset } = form;
  const contentValue = watch('content', '');
  
  const onEdit = (testimonial: any) => {
    const formData = handleEdit(testimonial);
    setValue('name', formData.name);
    setValue('role', formData.role);
    setValue('content', formData.content);
    setValue('avatar_url', formData.avatar_url);
  };

  const toggleReordering = () => {
    setReordering(!reordering);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <TestimonialForm
          form={form}
          isEditing={isEditing}
          onSubmit={saveTestimonial}
          onCancel={() => {
            resetForm();
            reset();
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
