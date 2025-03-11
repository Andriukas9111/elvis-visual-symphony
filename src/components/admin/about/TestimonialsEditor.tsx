
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar_url: string | null;
  is_featured: boolean;
  order_index: number;
}

export const TestimonialsEditor: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue } = useForm<Testimonial>();

  const fetchTestimonials = async () => {
    try {
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

  const onSubmit = async (data: Partial<Testimonial>) => {
    try {
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

      reset();
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to add testimonial',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = (url: string) => {
    setValue('avatar_url', url);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Testimonial</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name', { required: true })} />
              </div>
              
              <div>
                <Label htmlFor="role">Role/Company</Label>
                <Input id="role" {...register('role', { required: true })} />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  {...register('content', { required: true })}
                  className="min-h-[100px]"
                />
                <small className="text-muted-foreground">
                  Character count: {testimonials.length}/500
                </small>
              </div>
              
              <div>
                <Label>Profile Picture</Label>
                <ImageUpload
                  onUploadSuccess={handleImageUpload}
                  bucket="testimonials"
                  folder="avatars"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </form>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Existing Testimonials</h3>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      {testimonial.avatar_url && (
                        <img
                          src={testimonial.avatar_url}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-sm">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsEditor;
