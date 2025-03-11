
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface MainContentFormData {
  title: string;
  subtitle: string;
  job_title: string;
  story: string;
  profile_image: string | null;
}

const MainContentEditor: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<MainContentFormData>();
  
  const { data: content, isLoading } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single();
        
      if (error) throw error;
      return data;
    }
  });
  
  useEffect(() => {
    if (content) {
      reset({
        title: content.title,
        subtitle: content.subtitle,
        job_title: content.job_title,
        story: content.story,
        profile_image: content.profile_image
      });
      
      if (content.profile_image) {
        setImagePreview(content.profile_image);
      }
    }
  }, [content, reset]);
  
  const updateMutation = useMutation({
    mutationFn: async (formData: MainContentFormData) => {
      let profile_image = formData.profile_image;
      
      // Upload image if a new one is selected
      if (imageFile) {
        setIsUploading(true);
        const fileName = `profile_${Date.now()}_${imageFile.name}`;
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`profile/${fileName}`, imageFile);
          
        if (error) throw error;
        
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(`profile/${fileName}`);
          
        profile_image = urlData.publicUrl;
        setIsUploading(false);
      }
      
      const { data, error } = await supabase
        .from('about_content')
        .update({ 
          ...formData,
          profile_image
        })
        .eq('id', content.id);
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
      toast({
        title: "Success",
        description: "Main content updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating content:", error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: MainContentFormData) => {
    updateMutation.mutate(data);
  };
  
  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              {...register("title", { required: "Title is required" })} 
              className="bg-elvis-medium border-elvis-light" 
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input 
              id="subtitle" 
              {...register("subtitle")} 
              className="bg-elvis-medium border-elvis-light" 
            />
          </div>
          
          <div>
            <Label htmlFor="job_title">Job Title</Label>
            <Input 
              id="job_title" 
              {...register("job_title")} 
              className="bg-elvis-medium border-elvis-light" 
              placeholder="Videographer & Cinematographer"
            />
          </div>
          
          <div>
            <Label htmlFor="profile_image">Profile Image</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="profile_image" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="bg-elvis-medium border-elvis-light" 
              />
              {imagePreview && (
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="story">My Story</Label>
            <Textarea 
              id="story" 
              {...register("story", { required: "Story is required" })} 
              className="bg-elvis-medium border-elvis-light min-h-[200px]" 
            />
            {errors.story && <p className="text-red-500 text-sm mt-1">{errors.story.message}</p>}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!isDirty && !imageFile || updateMutation.isPending || isUploading}
          className="bg-elvis-pink hover:bg-elvis-pink/90"
        >
          {(updateMutation.isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default MainContentEditor;
