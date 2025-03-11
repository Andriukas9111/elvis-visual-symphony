
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { TestimonialData } from '@/components/home/about/types';
import { useCreateTestimonial, useUpdateTestimonial } from '@/hooks/api/useTestimonials';
import { Label } from '@/components/ui/label';

// Update schema to match required fields from TestimonialData
const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  position: z.string().optional(),
  quote: z.string().optional(),
  avatar: z.string().optional(),
  is_featured: z.boolean().default(false),
  rating: z.number().default(5)
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

interface TestimonialEditorProps {
  testimonial: Partial<TestimonialData> & { id?: string };
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
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial.name || '',
      role: testimonial.role || '',
      position: testimonial.position || '',
      company: testimonial.company || '',
      content: testimonial.content || '',
      quote: testimonial.quote || '',
      avatar: testimonial.avatar || '',
      is_featured: testimonial.is_featured || false,
      rating: testimonial.rating || 5
    }
  });

  const onSubmit = async (data: TestimonialFormData) => {
    try {
      setIsSaving(true);
      if (isNew) {
        await createTestimonial.mutateAsync(data);
      } else if (testimonial.id) {
        await updateTestimonial.mutateAsync({
          id: testimonial.id,
          updates: data
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isNew ? 'Add New Testimonial' : 'Edit Testimonial'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...register('role')} />
            {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position (Optional)</Label>
            <Input id="position" {...register('position')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register('company')} />
            {errors.company && <p className="text-sm text-red-500">{errors.company.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" {...register('content')} />
            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quote">Quote (Optional)</Label>
            <Textarea id="quote" {...register('quote')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL (Optional)</Label>
            <Input id="avatar" {...register('avatar')} />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_featured"
              onCheckedChange={(checked) => setValue('is_featured', checked)}
              defaultChecked={testimonial.is_featured}
            />
            <Label htmlFor="is_featured">Featured Testimonial</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TestimonialEditor;
