
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '../FileUpload';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface ImageUploadSectionProps {
  currentImage?: string | null;
  onImageUpdate: (url: string) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ 
  currentImage, 
  onImageUpdate 
}) => {
  const { toast } = useToast();

  const handleImageUpload = async (url: string) => {
    try {
      // Attempt to update the content immediately
      onImageUpdate(url);

      // Log success
      console.log('Profile image updated successfully:', url);

    } catch (error: any) {
      console.error('Error updating profile image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6 bg-elvis-medium">
      <CardHeader>
        <CardTitle className="text-lg">Profile Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentImage && (
            <div className="relative w-48 h-48 mx-auto mb-4">
              <img 
                src={currentImage} 
                alt="Current profile" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <FileUpload
            bucket="profiles"
            onUploadComplete={handleImageUpload}
            maxSize={10 * 1024 * 1024} // 10MB
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadSection;
