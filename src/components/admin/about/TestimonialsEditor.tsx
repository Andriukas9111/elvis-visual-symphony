
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, Star, Quote, Settings, Eye } from 'lucide-react';
import { Testimonial } from '@/components/home/about/types';
import AdminLoadingState from '../AdminLoadingState';
import TestimonialEditor from '../testimonials/TestimonialEditor';
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from '@/components/ui/slider';
import TestimonialCard from '@/components/home/about/TestimonialCard';

const TestimonialsEditor = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [previewLimit, setPreviewLimit] = useState<number>(150);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTestimonial, setPreviewTestimonial] = useState<Testimonial | null>(null);
  const [activeTab, setActiveTab] = useState('testimonials');

  // Fetch testimonials from Supabase
  const {
    data: testimonials,
    isLoading,
    error
  } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Testimonial[];
    }
  });

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
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const handleCancel = () => {
    setEditingTestimonial(null);
    setIsAddingNew(false);
  };
  
  const handlePreviewTestimonial = (testimonial: Testimonial) => {
    setPreviewTestimonial(testimonial);
    setPreviewOpen(true);
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
                            onClick={() => handlePreviewTestimonial(testimonial)}
                            title="Preview testimonial"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
      </TabsContent>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Configure how testimonials are displayed on the frontend
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="character-limit" className="font-medium">
                    Character Limit: <span className="text-elvis-pink">{previewLimit}</span> characters
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    Testimonials longer than this will show a "Read More" button
                  </span>
                </div>
                <Slider
                  id="character-limit"
                  min={50}
                  max={500}
                  step={10}
                  value={[previewLimit]}
                  onValueChange={(values) => setPreviewLimit(values[0])}
                  className="py-4"
                />
              </div>
              
              {testimonials && testimonials.length > 0 && (
                <div className="border rounded-lg p-4 bg-background/5">
                  <h3 className="text-sm font-medium mb-2">Preview:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.slice(0, 2).map((testimonial, index) => (
                      <div key={testimonial.id} className="bg-card rounded-lg border">
                        <TestimonialCard
                          testimonial={testimonial}
                          index={index}
                          isInView={true}
                          characterLimit={previewLimit}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              The character limit controls when testimonials are truncated on the public site.
            </p>
          </CardFooter>
        </Card>
      </TabsContent>
      
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="bg-elvis-medium border-elvis-pink/20 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle>Testimonial Preview</DialogTitle>
          </DialogHeader>
          
          {previewTestimonial && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {previewTestimonial.avatar ? (
                    <AvatarImage src={previewTestimonial.avatar} alt={previewTestimonial.name} />
                  ) : (
                    <AvatarFallback>{previewTestimonial.name.substring(0, 2)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-bold">{previewTestimonial.name}</p>
                  <p className="text-sm text-white/70">
                    {previewTestimonial.position}, {previewTestimonial.company}
                  </p>
                </div>
              </div>
              
              <div className="bg-elvis-dark/50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{previewTestimonial.quote}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="flex-1 h-px bg-white/20"></div>
                <p className="text-white/60">
                  {previewTestimonial.quote.length} characters
                </p>
                <div className="flex-1 h-px bg-white/20"></div>
              </div>
              
              <div>
                <p className="text-sm text-white/70">Preview with {previewLimit} character limit:</p>
                <div className="mt-2 bg-elvis-dark p-3 rounded border border-white/10">
                  {previewTestimonial.quote.length > previewLimit ? (
                    <>
                      <p>{previewTestimonial.quote.substring(0, previewLimit)}...</p>
                      <button className="text-elvis-pink text-sm mt-2 hover:underline">
                        Read More
                      </button>
                    </>
                  ) : (
                    <p>{previewTestimonial.quote}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default TestimonialsEditor;
