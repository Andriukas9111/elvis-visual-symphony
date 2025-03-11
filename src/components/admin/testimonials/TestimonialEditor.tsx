
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUploadFile } from '@/hooks/useSupabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';

export interface TestimonialData {
  id: string;
  client_name: string;
  client_title: string;
  client_company?: string;
  client_image?: string;
  content: string;
  rating?: number;
  is_featured: boolean;
  order_index?: number;
}

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
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TestimonialData>(testimonial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { mutateAsync: uploadFile } = useUploadFile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_featured: checked }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: TestimonialData) => {
      let avatarUrl = data.client_image;

      // Upload avatar if a new file is selected
      if (avatarFile) {
        try {
          const result = await uploadFile({ 
            bucket: 'about_section_media', 
            path: `testimonials/${Date.now()}-${avatarFile.name}`,
            file: avatarFile
          });
          avatarUrl = result;
        } catch (error) {
          console.error('Error uploading avatar:', error);
          throw new Error('Failed to upload avatar');
        }
      }

      const testimonialData = {
        ...data,
        client_image: avatarUrl
      };

      if (isNew) {
        const { data: newTestimonial, error } = await supabase
          .from('testimonials')
          .insert([testimonialData])
          .select()
          .single();

        if (error) throw error;
        return newTestimonial;
      } else {
        const { data: updatedTestimonial, error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        return updatedTestimonial;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({
        title: isNew ? 'Testimonial added' : 'Testimonial updated',
        description: isNew 
          ? 'New testimonial has been added successfully' 
          : 'Testimonial has been updated successfully'
      });
      onSave();
    },
    onError: (error) => {
      console.error('Error saving testimonial:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isNew ? 'add' : 'update'} testimonial`,
        variant: 'destructive'
      });
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    saveMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Add New Testimonial' : 'Edit Testimonial'}</CardTitle>
        <CardDescription>
          {isNew 
            ? 'Add a new client testimonial to showcase on your website' 
            : 'Update the details of this client testimonial'}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name*</Label>
                <Input
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_title">Role/Position*</Label>
                <Input
                  id="client_title"
                  name="client_title"
                  value={formData.client_title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client_company">Company</Label>
                <Input
                  id="client_company"
                  name="client_company"
                  value={formData.client_company || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
              <Label className="w-full">Client Photo</Label>
              <div className="flex flex-col items-center gap-2">
                <Avatar className="w-24 h-24">
                  {avatarFile ? (
                    <AvatarImage src={URL.createObjectURL(avatarFile)} alt="Preview" />
                  ) : formData.client_image ? (
                    <AvatarImage src={formData.client_image} alt={formData.client_name} />
                  ) : (
                    <AvatarFallback>{formData.client_name.substring(0, 2)}</AvatarFallback>
                  )}
                </Avatar>
                
                <Label 
                  htmlFor="avatar-upload" 
                  className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Testimonial Content*</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="featured">Featured Testimonial</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
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
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Testimonial'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TestimonialEditor;
