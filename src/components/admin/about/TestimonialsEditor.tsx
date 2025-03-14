
import React, { useState } from 'react';
import { useTestimonials, useDeleteTestimonial } from '@/hooks/api/useTestimonials';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TestimonialEditor from '../testimonials/TestimonialEditor';
import { toast } from 'sonner';
import { Testimonial } from '@/components/home/about/types';
import AdminLoadingState from '../AdminLoadingState';

const TestimonialsEditor: React.FC = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const deleteTestimonial = useDeleteTestimonial();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial>({
    id: '',
    name: '',
    position: '',
    company: '',
    quote: '',
    is_featured: false
  });
  
  const handleAddNew = () => {
    setCurrentTestimonial({
      id: '',
      name: '',
      position: '',
      company: '',
      quote: '',
      is_featured: false
    });
    setIsEditing(true);
  };
  
  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsEditing(true);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial.mutateAsync(id);
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      }
    }
  };
  
  const handleSave = () => {
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  if (isLoading) {
    return <AdminLoadingState />;
  }
  
  if (isEditing) {
    return (
      <TestimonialEditor
        testimonial={currentTestimonial}
        onSave={handleSave}
        onCancel={handleCancel}
        isNew={!currentTestimonial.id}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Testimonials</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>
      
      {testimonials && testimonials.length > 0 ? (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {testimonial.name}
                      {testimonial.is_featured && (
                        <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-200 ml-2">
                          <Star className="h-3 w-3 mr-1" /> Featured
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.position} {testimonial.company && `at ${testimonial.company}`}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                  {testimonial.quote.length > 200
                    ? `${testimonial.quote.substring(0, 200)}...`
                    : testimonial.quote}
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No testimonials found. Add your first testimonial.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestimonialsEditor;
