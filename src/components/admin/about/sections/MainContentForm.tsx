
import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAboutForm } from '../hooks/useAboutForm';
import FormActions from '../ui/FormActions';
import FormError from '../ui/FormError';
import SavedIndicator from '../ui/SavedIndicator';
import ImageUpload from '../ui/ImageUpload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AboutContentData {
  id: string;
  title: string;
  subtitle: string;
  job_title: string;
  story: string;
  profile_image: string | null;
}

const MainContentForm: React.FC = () => {
  const {
    currentData,
    isDirty,
    isSubmitting,
    error,
    lastSaved,
    updateForm,
    setInitialData,
    startSubmitting,
    submissionSuccess,
    submissionError,
    discardChanges
  } = useAboutForm<AboutContentData>();
  
  // Fetch the about content data
  const { data: aboutContent, isLoading } = useQuery({
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
        return data as AboutContentData;
      } catch (error) {
        console.error('Error in about content fetch function:', error);
        throw error;
      }
    }
  });
  
  // Set the initial form data when the query completes
  useEffect(() => {
    if (aboutContent) {
      setInitialData(aboutContent);
    }
  }, [aboutContent]);
  
  // Save mutation
  const saveContentMutation = useMutation({
    mutationFn: async (formData: AboutContentData) => {
      console.log('Saving about content:', formData);
      
      try {
        // Check if we need to update or insert
        if (formData.id) {
          const { data, error } = await supabase
            .from('about_content')
            .update({
              title: formData.title,
              subtitle: formData.subtitle,
              job_title: formData.job_title,
              story: formData.story,
              profile_image: formData.profile_image
            })
            .eq('id', formData.id)
            .select();
            
          if (error) throw error;
          return data[0];
        } else {
          const { data, error } = await supabase
            .from('about_content')
            .insert([{
              title: formData.title,
              subtitle: formData.subtitle,
              job_title: formData.job_title,
              story: formData.story,
              profile_image: formData.profile_image
            }])
            .select();
            
          if (error) throw error;
          return data[0];
        }
      } catch (error: any) {
        console.error('Error saving about content:', error);
        throw new Error(`Failed to save content: ${error.message}`);
      }
    },
    onSuccess: (data) => {
      submissionSuccess(data);
    },
    onError: (error: Error) => {
      submissionError(error.message);
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentData || !isDirty) return;
    
    startSubmitting();
    saveContentMutation.mutate(currentData);
  };
  
  // Handle image upload
  const handleImageUploaded = (url: string) => {
    updateForm({ profile_image: url });
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-elvis-pink" />
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>About Me Content</CardTitle>
            <SavedIndicator lastSaved={lastSaved} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <FormError error={error} />
          
          {currentData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={currentData.title || ''} 
                      onChange={(e) => updateForm({ title: e.target.value })}
                      className="bg-elvis-medium border-elvis-light" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input 
                      id="subtitle" 
                      value={currentData.subtitle || ''} 
                      onChange={(e) => updateForm({ subtitle: e.target.value })}
                      className="bg-elvis-medium border-elvis-light" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input 
                      id="job_title" 
                      value={currentData.job_title || ''} 
                      onChange={(e) => updateForm({ job_title: e.target.value })}
                      className="bg-elvis-medium border-elvis-light" 
                      placeholder="Videographer & Cinematographer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile_image">Profile Image</Label>
                    <ImageUpload
                      currentImageUrl={currentData.profile_image}
                      onImageUploaded={handleImageUploaded}
                      bucket="profiles"
                      folder="avatars"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="story">My Story</Label>
                    <Textarea 
                      id="story" 
                      value={currentData.story || ''} 
                      onChange={(e) => updateForm({ story: e.target.value })}
                      className="bg-elvis-medium border-elvis-light min-h-[300px]" 
                    />
                  </div>
                </div>
              </div>
              
              <FormActions
                isDirty={isDirty}
                isSubmitting={isSubmitting}
                onSave={handleSubmit}
                onDiscard={discardChanges}
              />
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default MainContentForm;
