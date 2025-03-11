
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<MainContentFormData>();
  
  const { data: content, isLoading, isError, error: fetchError } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      console.log('Fetching about content data');
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .limit(1)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching about content:', error);
          throw error;
        }
        console.log('Successfully fetched about content:', data);
        return data;
      } catch (error) {
        console.error('Error in about content fetch function:', error);
        throw error;
      }
    }
  });
  
  useEffect(() => {
    if (content) {
      console.log('Resetting form with content:', content);
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
      console.log('Starting update mutation with data:', formData);
      setSaveError(null);
      let profile_image = formData.profile_image;
      
      // Upload image if a new one is selected
      if (imageFile) {
        setIsUploading(true);
        console.log('Uploading new profile image:', imageFile.name);
        const fileName = `profile_${Date.now()}_${imageFile.name}`;
        
        try {
          // Upload the file to the profiles bucket
          const { data, error } = await supabase.storage
            .from('profiles')
            .upload(`avatars/${fileName}`, imageFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (error) {
            console.error('Error uploading profile image:', error);
            throw error;
          }
          
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('profiles')
            .getPublicUrl(`avatars/${fileName}`);
            
          profile_image = urlData.publicUrl;
          console.log('Profile image uploaded successfully:', profile_image);
        } catch (error: any) {
          console.error('File upload error:', error);
          // More detailed error for debugging
          if (error.error) {
            console.error('Error details:', {
              errorMessage: error.error,
              errorStatus: error.status,
              errorStatusText: error.statusText,
              path: `profiles/avatars/${fileName}`
            });
          }
          setSaveError(`File upload failed: ${error.message || 'Unknown error'}`);
          setIsUploading(false);
          throw error;
        }
        
        setIsUploading(false);
      }
      
      console.log('Updating about_content with profile_image:', profile_image);
      
      // Check if content.id exists
      if (!content?.id) {
        console.log('No existing about_content record found, creating new record');
        const { data, error } = await supabase
          .from('about_content')
          .insert([{ 
            ...formData,
            profile_image,
          }])
          .select();
          
        if (error) {
          console.error('Error creating about_content:', error);
          throw error;
        }
        
        return data[0];
      } else {
        console.log('Updating existing about_content record id:', content.id);
        const { data, error } = await supabase
          .from('about_content')
          .update({ 
            ...formData,
            profile_image
          })
          .eq('id', content.id)
          .select();
          
        if (error) {
          console.error('Error updating about_content:', error);
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.error('No data returned from update');
          throw new Error('No data returned from update');
        }
        
        return data[0];
      }
    },
    onSuccess: (data) => {
      console.log('Update successful:', data);
      queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
      toast({
        title: "Success",
        description: "Main content updated successfully",
      });
      setSaveError(null);
    },
    onError: (error: any) => {
      console.error("Error updating content:", error);
      const errorMessage = error.message || "Failed to update content";
      setSaveError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('New image selected:', file.name);
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: MainContentFormData) => {
    console.log('Form submitted with data:', data);
    updateMutation.mutate(data);
  };
  
  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }
  
  if (isError) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-md p-4 my-4">
        <h3 className="text-red-500 font-medium">Error Loading Content</h3>
        <p className="text-sm text-red-400">{(fetchError as Error)?.message || 'Unknown error occurred'}</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['aboutContent'] })}
          variant="outline"
          size="sm"
          className="mt-2 border-red-500 text-red-500 hover:bg-red-500/20"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {saveError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Saving Content</AlertTitle>
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
      
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
          disabled={(!isDirty && !imageFile) || updateMutation.isPending || isUploading}
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
