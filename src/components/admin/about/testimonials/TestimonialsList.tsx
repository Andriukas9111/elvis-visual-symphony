
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye, Quote, Star } from 'lucide-react';
import { Testimonial } from '@/components/home/about/types';
import AdminLoadingState from '../../AdminLoadingState';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TestimonialsListProps {
  testimonials: Testimonial[];
  isLoading: boolean;
  error: Error | null;
  previewLimit: number;
  onEdit: (testimonial: Testimonial) => void;
  onPreview: (testimonial: Testimonial) => void;
}

const TestimonialsList: React.FC<TestimonialsListProps> = ({
  testimonials,
  isLoading,
  error,
  previewLimit,
  onEdit,
  onPreview
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete testimonial mutation
  const deleteMutation = useMutation({
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
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully'
      });
    },
    onError: (error) => {
      console.error('Error deleting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete testimonial',
        variant: 'destructive'
      });
    }
  });

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 mb-2">Error loading testimonials</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials</CardTitle>
        <CardDescription>
          Manage client testimonials displayed in the About section
        </CardDescription>
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
                        {testimonial.avatar ? (
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        ) : (
                          <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{testimonial.name}</CardTitle>
                          {testimonial.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.position}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPreview(testimonial)}
                        title="Preview testimonial"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(testimonial)}
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
                      {testimonial.quote.length > previewLimit 
                        ? `${testimonial.quote.substring(0, previewLimit)}...` 
                        : testimonial.quote}
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

export default TestimonialsList;
