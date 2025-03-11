
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, Plus, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ImageUpload } from '@/components/common/ImageUpload';
import { TestimonialFormData } from './types';

interface TestimonialFormProps {
  form: UseFormReturn<TestimonialFormData>;
  isEditing: boolean;
  onSubmit: (data: TestimonialFormData) => void;
  onCancel: () => void;
  contentValue: string;
}

export const TestimonialForm: React.FC<TestimonialFormProps> = ({
  form,
  isEditing,
  onSubmit,
  onCancel,
  contentValue,
}) => {
  const { register, handleSubmit, setValue, watch } = form;
  const currentAvatarUrl = watch('avatar_url');

  const handleImageUpload = (url: string) => {
    console.log('Image uploaded, setting avatar_url to:', url);
    setValue('avatar_url', url);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name', { required: true })} />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...register('role', { required: true })} />
          </div>
          
          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" {...register('company')} />
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
              currentImageUrl={currentAvatarUrl}
              bucket="testimonials"
              folder="avatars"
            />
            <input 
              type="hidden" 
              {...register('avatar_url')} 
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
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
