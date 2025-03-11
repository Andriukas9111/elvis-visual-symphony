
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestimonialsList from './testimonials/TestimonialsList';
import TestimonialDisplaySettings from './testimonials/TestimonialDisplaySettings';
import TestimonialEditor from '../testimonials/TestimonialEditor';
import { Testimonial } from '@/components/home/about/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TestimonialPreviewDialog from './testimonials/TestimonialPreviewDialog';
import { useTestimonials } from '@/hooks/api/useTestimonials';

const TestimonialsEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('testimonials');
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [previewLimit, setPreviewLimit] = useState<number>(150);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTestimonial, setPreviewTestimonial] = useState<Testimonial | null>(null);
  
  const {
    data: testimonials,
    isLoading,
    error
  } = useTestimonials();

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingTestimonial({
      id: '',
      name: '',
      position: '',
      company: '',
      quote: '',
      avatar: '',
      is_featured: false
    });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    setEditingTestimonial(null);
    setIsAddingNew(false);
  };

  const handleCancel = () => {
    setEditingTestimonial(null);
    setIsAddingNew(false);
  };
  
  const handlePreviewTestimonial = (testimonial: Testimonial) => {
    setPreviewTestimonial(testimonial);
    setPreviewOpen(true);
  };

  if (editingTestimonial || isAddingNew) {
    return (
      <TestimonialEditor
        testimonial={editingTestimonial!}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={isAddingNew}
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="settings">Display Settings</TabsTrigger>
        </TabsList>
        
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>
      
      <TabsContent value="testimonials">
        <TestimonialsList 
          testimonials={testimonials || []}
          isLoading={isLoading}
          error={error}
          previewLimit={previewLimit}
          onEdit={handleEditTestimonial}
          onPreview={handlePreviewTestimonial}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <TestimonialDisplaySettings 
          previewLimit={previewLimit}
          setPreviewLimit={setPreviewLimit}
          testimonials={testimonials || []}
        />
      </TabsContent>
      
      <TestimonialPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        testimonial={previewTestimonial}
        previewLimit={previewLimit}
      />
    </Tabs>
  );
};

export default TestimonialsEditor;
