
import React, { useState } from 'react';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Upload, X } from 'lucide-react';
import { TestimonialData, useTestimonials } from '@/hooks/api/useTestimonials';
import { useFileUpload } from '@/hooks/api/useFileUpload';

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
  const [formData, setFormData] = useState<TestimonialData>(testimonial);
  const [isUploading, setIsUploading] = useState(false);
  const { createTestimonial, updateTestimonial } = useTestimonials();
  const { uploadFile } = useFileUpload();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_featured: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    try {
      setIsUploading(true);
      const imageUrl = await uploadFile(file, 'testimonials');
      setFormData(prev => ({ ...prev, client_image: imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, client_image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isNew) {
        await createTestimonial.mutateAsync(formData);
      } else {
        await updateTestimonial.mutateAsync({
          id: formData.id,
          updates: formData
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isNew ? 'Add New Testimonial' : 'Edit Testimonial'}</CardTitle>
          <CardDescription>
            {isNew 
              ? 'Create a new client testimonial' 
              : 'Update the existing testimonial details'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="h-16 w-16">
                {formData.client_image ? (
                  <AvatarImage src={formData.client_image} alt={formData.client_name} />
                ) : (
                  <AvatarFallback className="text-lg">
                    {formData.client_name ? formData.client_name.substring(0, 2) : 'CT'}
                  </AvatarFallback>
                )}
              </Avatar>
              
              {formData.client_image && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div>
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm">
                  <Upload className="h-4 w-4" />
                  {formData.client_image ? 'Change Image' : 'Upload Image'}
                </div>
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Recommended: Square image, 200×200px
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Name</Label>
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Client's full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client_title">Title / Position</Label>
              <Input
                id="client_title"
                name="client_title"
                value={formData.client_title}
                onChange={handleChange}
                placeholder="e.g. Marketing Director"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client_company">Company</Label>
            <Input
              id="client_company"
              name="client_company"
              value={formData.client_company || ''}
              onChange={handleChange}
              placeholder="Company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Testimonial Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What the client said about your work..."
              rows={5}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={handleSwitchChange}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="is_featured" className="flex items-center gap-2">
                Featured Testimonial 
                <Star className="h-4 w-4 text-yellow-500" />
              </Label>
              <p className="text-sm text-muted-foreground">
                Featured testimonials are displayed prominently on the website
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isUploading || !formData.client_name || !formData.content}
          >
            {isNew ? 'Create Testimonial' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TestimonialEditor;
