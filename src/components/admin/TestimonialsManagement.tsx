
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, Star, Quote } from 'lucide-react';
import AdminLoadingState from './AdminLoadingState';
import TestimonialEditor from './testimonials/TestimonialEditor';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TestimonialData, useTestimonials } from '@/hooks/api/useTestimonials';

const TestimonialsManagement: React.FC = () => {
  const { toast } = useToast();
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Use the custom hook for testimonials operations
  const {
    testimonials,
    isLoading,
    error,
    deleteTestimonial,
  } = useTestimonials();

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteTestimonial.mutate(id);
    }
  };

  const handleEditTestimonial = (testimonial: TestimonialData) => {
    setEditingTestimonial(testimonial);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingTestimonial({
      id: '',
      client_name: '',
      client_title: '',
      client_company: '',
      content: '',
      client_image: '',
      is_featured: false,
      rating: 5
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

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-2">Error loading testimonials</p>
        <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
      </div>
    );
  }

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Testimonials Management</CardTitle>
          <CardDescription>
            Manage client testimonials displayed in the About section
          </CardDescription>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </CardHeader>
      
      <CardContent>
        {testimonials && testimonials.length > 0 ? (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border border-border">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {testimonial.client_image ? (
                          <AvatarImage src={testimonial.client_image} alt={testimonial.client_name} />
                        ) : (
                          <AvatarFallback>{testimonial.client_name.substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{testimonial.client_name}</CardTitle>
                          {testimonial.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.client_title}, {testimonial.client_company}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTestimonial(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-start gap-2">
                    <Quote className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground">
                      {testimonial.content.length > 150 
                        ? `${testimonial.content.substring(0, 150)}...` 
                        : testimonial.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No testimonials found. Add your first client testimonial.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestimonialsManagement;
