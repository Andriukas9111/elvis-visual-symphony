
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { uploadFile } from '@/utils/upload/fileUpload';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  bucket?: string;
  folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  currentImageUrl,
  bucket = 'profiles',
  folder = 'avatars'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentImageUrl) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      console.log(`Uploading file to bucket: ${bucket}, folder: ${folder}`);
      const { publicUrl } = await uploadFile(file, bucket, folder);
      console.log('Upload successful, public URL:', publicUrl);
      onUploadSuccess(publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please make sure you're logged in with proper permissions.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUploadSuccess('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden group">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      ) : null}
      
      <div className="flex gap-4 items-center">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {preview ? 'Change Image' : 'Upload Image'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
