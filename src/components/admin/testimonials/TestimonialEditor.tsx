
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Testimonial } from '@/components/home/about/types';
import { useCreateTestimonial, useUpdateTestimonial } from '@/hooks/api/useTestimonials';

interface TestimonialEditorProps {
  testimonial: Testimonial;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}

const TestimonialEditor: React.FC<TestimonialEditorProps> = ({
  testimonial,
  onSave,
  onCancel,
  isNew
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Testimonial>({
    ...testimonial,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();

  const handleChange = (field: keyof Testimonial, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isNew) {
        // Create new testimonial
        await createTestimonial.mutateAsync({
          name: formData.name,
          position: formData.position,
          company: formData.company,
          quote: formData.quote,
          avatar: formData.avatar,
          is_featured: formData.is_featured
        });
        
        toast({
          title: "Testimonial created",
          description: "Your testimonial has been created successfully."
        });
      } else {
        // Update existing testimonial
        await updateTestimonial.mutateAsync({
          id: formData.id,
          updates: {
            name: formData.name,
            position: formData.position,
            company: formData.company,
            quote: formData.quote,
            avatar: formData.avatar,
            is_featured: formData.is_featured
          }
        });
        
        toast({
          title: "Testimonial updated",
          description: "Your testimonial has been updated successfully."
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>{isNew ? 'Add New' : 'Edit'} Testimonial</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="CEO"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Acme Inc."
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar URL (Optional)</Label>
              <Input
                id="avatar"
                value={formData.avatar || ''}
                onChange={(e) => handleChange('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="quote">Testimonial Quote</Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) => handleChange('quote', e.target.value)}
                placeholder="Enter the testimonial content here"
                required
                rows={5}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleChange('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Feature this testimonial</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isNew ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialEditor;
