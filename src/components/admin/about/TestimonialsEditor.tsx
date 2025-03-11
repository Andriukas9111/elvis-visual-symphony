import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Edit, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestimonial, setSelectedTestimonial] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reordering, setReordering] = useState(false);
  
  const itemsPerPage = 5;
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch } = useForm<Testimonial>();
  const contentValue = watch('content', '');

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

  const onSubmit = async (data: Partial<Testimonial>) => {
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

      reset();
      setIsEditing(false);
      setSelectedTestimonial(null);
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

  const handleImageUpload = (url: string) => {
    setValue('avatar_url', url);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setIsEditing(true);
    setSelectedTestimonial(testimonial.id);
    setValue('name', testimonial.name);
    setValue('role', testimonial.role);
    setValue('content', testimonial.content);
    setValue('avatar_url', testimonial.avatar_url || '');
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

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedTestimonial(null);
    reset();
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

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
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
                  {...register('content', { required: true, maxLength: 500 })}
                  className="min-h-[100px]"
                />
                <small className={`text-sm ${contentValue?.length > 450 ? 'text-orange-500' : contentValue?.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  Character count: {contentValue?.length || 0}/500
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
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {isEditing ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </>
                )}
              </Button>
              
              {isEditing && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Existing Testimonials</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setReordering(!reordering)}
              >
                {reordering ? 'Done Reordering' : 'Reorder Testimonials'}
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            <Card>
              <CardContent className="py-4 text-center text-muted-foreground">
                No testimonials yet. Add your first one above.
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedTestimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{testimonial.name}</h4>
                            {testimonial.is_featured && (
                              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {reordering ? (
                            <div className="flex flex-col gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => moveTestimonial(testimonial.id, 'up')}
                                disabled={testimonials.indexOf(testimonial) === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => moveTestimonial(testimonial.id, 'down')}
                                disabled={testimonials.indexOf(testimonial) === testimonials.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Select 
                                value={testimonial.is_featured ? 'featured' : 'normal'}
                                onValueChange={(value) => {
                                  updateTestimonialFeatured(testimonial.id, value === 'featured');
                                }}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="featured">Featured</SelectItem>
                                  <SelectItem value="normal">Not Featured</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEdit(testimonial)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(testimonial.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                          {testimonial.avatar_url && (
                            <img
                              src={testimonial.avatar_url}
                              alt={testimonial.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => setCurrentPage(index + 1)}
                          isActive={currentPage === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsEditor;
