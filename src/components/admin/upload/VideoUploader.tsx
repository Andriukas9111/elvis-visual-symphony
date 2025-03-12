
import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Video, Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import { VideoErrorData } from '@/components/portfolio/video-player/utils';

interface VideoUploaderProps {
  onComplete: (data: any) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create a video preview
    const videoUrl = URL.createObjectURL(selectedFile);
    setPreview(videoUrl);
  };

  const uploadVideo = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setProgress(0);
      
      // Generate file paths
      const videoId = uuidv4();
      const fileExt = file.name.split('.').pop();
      const filePath = `${videoId}.${fileExt}`;
      
      console.log(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB) to videos/${filePath}`);
      
      // Upload the video file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          // Use onProgressChange method from FileOptions
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded * 100) / progress.total);
            setProgress(percent);
            console.log(`Upload progress: ${percent}%`);
          }
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the video URL
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      console.log('Video upload complete, public URL:', urlData.publicUrl);
      
      // Create a thumbnail from the video
      let thumbnailUrl = null;
      
      try {
        thumbnailUrl = await generateThumbnail(file, videoId);
      } catch (thumbError) {
        console.error('Failed to generate thumbnail:', thumbError);
        // Continue even if thumbnail generation fails
      }
      
      // Create a media entry
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert({
          id: videoId,
          title: file.name.split('.')[0],
          type: 'video',
          file_url: urlData.publicUrl,
          video_url: urlData.publicUrl,
          video_id: null, // Adding video_id field explicitly set to null
          thumbnail_url: thumbnailUrl,
          file_type: file.type,
          file_size: file.size,
          is_published: true,
          orientation: 'horizontal'
        })
        .select('*')
        .single();

      if (mediaError) {
        throw mediaError;
      }

      setIsUploading(false);
      setProgress(100);
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded",
      });

      // Return the media data to the parent component
      onComplete(mediaData);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message);
      setIsUploading(false);
      
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const generateThumbnail = async (videoFile: File, videoId: string): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      try {
        // Create a video element to extract a frame
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Could not get canvas context');
          return;
        }

        // When metadata is loaded, set current time to extract frame
        video.onloadedmetadata = () => {
          video.currentTime = Math.min(1, video.duration * 0.25);
        };

        // Once we've seeked to the time, draw the frame
        video.onseeked = async () => {
          // Set canvas dimensions to video dimensions
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the video frame to the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to blob
          canvas.toBlob(async (blob) => {
            if (!blob) {
              reject('Failed to create thumbnail blob');
              return;
            }
            
            // Upload thumbnail to storage
            const fileExt = 'jpg';
            const filePath = `${videoId}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('thumbnails')
              .upload(filePath, blob, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: true
              });
              
            if (uploadError) {
              reject(uploadError);
              return;
            }
            
            // Get the thumbnail URL
            const { data: urlData } = supabase.storage
              .from('thumbnails')
              .getPublicUrl(filePath);
              
            console.log('Thumbnail created:', urlData.publicUrl);
            
            // Return the thumbnail URL
            resolve(urlData.publicUrl);
          }, 'image/jpeg', 0.8);
        };
        
        // Set source and begin loading
        video.src = URL.createObjectURL(videoFile);
        video.load();
        
        // Handle errors
        video.onerror = () => {
          reject('Error generating thumbnail from video');
        };
        
      } catch (err) {
        console.error('Thumbnail generation error:', err);
        reject(err);
      }
    });
  };

  const reset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-white/40 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Video className="mx-auto h-12 w-12 text-white/40 mb-3" />
          <h3 className="text-lg font-medium mb-2">Upload a Video</h3>
          <p className="text-white/60 mb-4">
            Click or drag and drop to upload a video
          </p>
          <p className="text-xs text-white/40">
            MP4, WebM and MOV files supported. Up to 10GB.
          </p>
          <Button 
            className="mt-4" 
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Video
          </Button>
        </div>
      ) : (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-elvis-light">
          <div className="p-3 flex justify-between items-center bg-elvis-medium">
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span className="font-medium truncate">{file.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled={isUploading}
              onClick={reset}
              className="h-7 w-7 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4">
            {preview && (
              <div className="mb-4 rounded overflow-hidden bg-black aspect-video">
                <video
                  src={preview}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm mb-2">
              <span>File size: {(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              {progress > 0 && progress < 100 && <span>{progress}%</span>}
            </div>
            
            {progress > 0 && (
              <Progress value={progress} className="h-2 mb-4" />
            )}
            
            {error && (
              <div className="bg-red-900/30 border border-red-700 p-3 rounded-md mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
            
            {progress === 100 && !error ? (
              <div className="bg-green-900/30 border border-green-700 p-3 rounded-md mb-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-200">Upload completed successfully</p>
              </div>
            ) : (
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={reset}
                  disabled={isUploading}
                  className="border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={uploadVideo}
                  disabled={isUploading || progress === 100}
                  className="bg-elvis-pink hover:bg-elvis-pink-dark"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-pulse">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
