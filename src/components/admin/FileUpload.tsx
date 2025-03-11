
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  bucket: 'images' | 'profiles';
  maxSize?: number;
  accept?: Record<string, string[]>;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete, 
  bucket,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
  }
}) => {
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Starting file upload:', {
        bucket,
        fileName,
        fileSize: file.size,
        fileType: file.type
      });

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', data);

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrl);

      onUploadComplete(publicUrl);
      
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      console.error('File upload failed:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    }
  }, [bucket, onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-elvis-pink bg-elvis-pink/10' : 'border-gray-600 hover:border-elvis-pink'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-sm text-gray-300">
        {isDragActive ? (
          'Drop the file here'
        ) : (
          'Drag & drop a file here, or click to select'
        )}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Max file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
      </p>
    </div>
  );
};

export default FileUpload;
