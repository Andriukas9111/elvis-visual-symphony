
import React, { useState } from 'react';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
  currentImageUrl: string | null;
  onImageUploaded: (url: string) => void;
  bucket: string;
  folder: string;
  maxSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUploaded,
  bucket,
  folder,
  maxSize = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  
  const validateFile = (file: File): boolean => {
    setError(null);
    
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image');
      return false;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File is too large. Maximum size is ${maxSize}MB`);
      return false;
    }
    
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!validateFile(file)) {
      e.target.value = '';
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload the file
    uploadFile(file);
  };
  
  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `${folder}/${fileName}`;
      
      console.log(`Uploading file to ${bucket}/${filePath}`);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        console.error('Upload error:', error);
        setError(`Upload failed: ${error.message}`);
        setIsUploading(false);
        return;
      }
      
      console.log('Upload successful:', data);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
        
      console.log('Public URL:', urlData.publicUrl);
      
      onImageUploaded(urlData.publicUrl);
    } catch (err: any) {
      console.error('Unexpected upload error:', err);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearImage = () => {
    setImagePreview(null);
    onImageUploaded('');
  };
  
  return (
    <div className="space-y-4">
      {imagePreview ? (
        <div className="relative">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full max-w-md h-auto rounded-md border border-border" 
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-md p-6 text-center bg-background">
          <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Drag and drop an image, or click to browse
          </p>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm mt-1">
          {error}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={isUploading}
          className="relative"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {imagePreview ? 'Replace Image' : 'Upload Image'}
            </>
          )}
        </Button>
        
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        {imagePreview && (
          <Button
            type="button"
            variant="outline"
            onClick={clearImage}
            disabled={isUploading}
          >
            <X className="mr-2 h-4 w-4" />
            Remove Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
