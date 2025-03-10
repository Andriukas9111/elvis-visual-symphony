
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { Testimonial } from '@/components/home/about/types';

interface TestimonialEditorProps {
  testimonial: Testimonial;
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
  const [name, setName] = useState(testimonial.name);
  const [position, setPosition] = useState(testimonial.position);
  const [company, setCompany] = useState(testimonial.company);
  const [quote, setQuote] = useState(testimonial.quote);
  const [avatar, setAvatar] = useState(testimonial.avatar || '');
  const [isFeatured, setIsFeatured] = useState(testimonial.is_featured || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      
      // Validation
      if (!name || !position || !company || !quote) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }
      
      const testimonialData = {
        name,
        position,
        company,
        quote,
        avatar,
        is_featured: isFeatured
      };
      
      if (isNew) {
        const { error } = await supabase
          .from('testimonials')
          .insert(testimonialData);
          
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'New testimonial added successfully'
        });
      } else {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', testimonial.id);
          
        if (error) throw error;
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Add New Testimonial' : 'Edit Testimonial'}</CardTitle>
        <CardDescription>
          {isNew 
            ? 'Create a new customer testimonial'
            : 'Update this testimonial'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Client Position"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quote">Testimonial Quote</Label>
          <Textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Client testimonial text"
            rows={5}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is-featured"
            checked={isFeatured}
            onCheckedChange={setIsFeatured}
          />
          <Label htmlFor="is-featured">Featured Testimonial</Label>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={isSubmitting}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Testimonial'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestimonialEditor;
