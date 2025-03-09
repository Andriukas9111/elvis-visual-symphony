
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface MediaUploaderProps {
  onUploadComplete: (mediaData: any) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadStatus('idle');
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(5); // Start progress indicator

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      
      setUploadProgress(60);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      // Create a media entry in the database
      const mediaType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 'file';
      
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert([{
          title: file.name.split('.')[0],
          slug: file.name.split('.')[0].toLowerCase().replace(/\s+/g, '-'),
          description: '',
          type: mediaType,
          category: 'uncategorized',
          media_url: urlData.publicUrl,
          thumbnail_url: mediaType === 'image' ? urlData.publicUrl : null,
          is_published: false,
        }])
        .select()
        .single();

      if (mediaError) throw mediaError;

      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: 'Upload successful',
        description: 'Your media has been uploaded successfully.',
      });
      
      onUploadComplete(mediaData);
      
      // Reset the form after a successful upload
      setTimeout(() => {
        clearFile();
        setIsUploading(false);
      }, 1500);
      
    } catch (error: any) {
      console.error('Upload error:', error.message);
      setUploadStatus('error');
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-elvis-light rounded-lg border border-white/10">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 cursor-pointer hover:border-elvis-pink/50 transition-colors">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          
          {!file ? (
            <div 
              className="flex flex-col items-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-white/40 mb-2" />
              <p className="text-lg font-medium">Drop files here or click to upload</p>
              <p className="text-sm text-white/60 mt-1">
                Support for images and videos
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-white/60">
                    ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploadStatus === 'uploading' && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <div className="text-sm text-white/60 text-right">
                    {uploadProgress}%
                  </div>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="flex items-center text-green-500 space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Upload complete</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center text-red-500 space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Upload failed</span>
                </div>
              )}
            </div>
          )}
        </div>

        {file && uploadStatus !== 'success' && (
          <Button 
            className="w-full bg-elvis-pink hover:bg-elvis-pink/80"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
