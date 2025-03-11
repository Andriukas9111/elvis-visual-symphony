
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTestimonial, useUpdateTestimonial } from '@/hooks/api/useTestimonials';
import { TestimonialData } from '@/components/home/about/types';

interface TestimonialEditorProps {
  testimonial: TestimonialData;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}

const TestimonialEditor: React.FC<TestimonialEditorProps> = ({
  testimonial,
  onSave,
  onCancel,
  isNew = false
}) => {
  const { toast } = useToast();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const [formData, setFormData] = useState<Partial<TestimonialData>>(testimonial);

  const handleChange = (field: keyof TestimonialData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.company || !formData.content) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      if (isNew) {
        await createMutation.mutateAsync({
          name: formData.name || '',
          role: formData.role || '',
          position: formData.position,
          company: formData.company || '',
          content: formData.content || '',
          quote: formData.quote,
          avatar: formData.avatar,
          is_featured: formData.is_featured || false
        });
        
        toast({
          title: 'Success',
          description: 'Testimonial added successfully'
        });
      } else {
        await updateMutation.mutateAsync({
          id: testimonial.id,
          updates: {
            name: formData.name,
            role: formData.role,
            position: formData.position,
            company: formData.company,
            content: formData.content,
            quote: formData.quote,
            avatar: formData.avatar,
            is_featured: formData.is_featured
          }
        });
        
        toast({
          title: 'Success',
          description: 'Testimonial updated successfully'
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to save testimonial',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Add New Testimonial' : 'Edit Testimonial'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Client Role</Label>
                <Input
                  id="role"
                  value={formData.role || ''}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="Marketing Director"
                />
              </div>
              
              <div>
                <Label htmlFor="position">Position (Optional)</Label>
                <Input
                  id="position"
                  value={formData.position || ''}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="Senior Manager"
                />
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
              
              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formData.avatar || ''}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Testimonial Content</Label>
                <Textarea
                  id="content"
                  value={formData.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="What the client said about your work..."
                  className="h-40"
                />
              </div>
              
              <div>
                <Label htmlFor="quote">Short Quote (Optional)</Label>
                <Textarea
                  id="quote"
                  value={formData.quote || ''}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  placeholder="A brief quote to highlight"
                  className="h-20"
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured || false}
                  onCheckedChange={(checked) => handleChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Feature this testimonial</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit">
              {isNew ? 'Add Testimonial' : 'Update Testimonial'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialEditor;
