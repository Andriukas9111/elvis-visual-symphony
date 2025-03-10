import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Loader2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFileUploader } from '@/hooks/admin/useFileUploader';
import { useAnimation } from '@/contexts/AnimationContext';
import FilePreview from './components/FilePreview';
import UploadPrompt from './components/UploadPrompt';
import ThumbnailSelector from './components/ThumbnailSelector';
import { useThumbnailGenerator } from '@/hooks/admin/upload/useThumbnailGenerator';
import { supabase } from '@/lib/supabase';

interface FileUploadTabProps {
  onUploadComplete: (mediaData: any) => void;
}

const FileUploadTab: React.FC<FileUploadTabProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedMediaId, setUploadedMediaId] = useState<string | null>(null);
  const [isThumbnailSectionVisible, setIsThumbnailSectionVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { prefersReducedMotion } = useAnimation();
  
  // Use our file uploader hook
  const { uploadProgress, uploadStatus, isUploading, uploadFile, clearUploadState } = useFileUploader({
    onUploadComplete: (mediaData) => {
      // Save the media ID for thumbnail updates
      setUploadedMediaId(mediaData.id);
      
      // If it's a video, show the thumbnail section
      if (mediaData.type === 'video') {
        setIsThumbnailSectionVisible(true);
        // Generate thumbnails automatically
        if (file) {
          generateThumbnails(file);
        }
      } else {
        onUploadComplete(mediaData);
      }
    }
  });
  
  // Use the thumbnail generator hook
  const { 
    thumbnails, 
    isGenerating, 
    selectedThumbnail, 
    generateThumbnails, 
    selectThumbnail,
    saveThumbnail
  } = useThumbnailGenerator();

  // Reset the form state
  const resetForm = () => {
    setFile(null);
    clearUploadState();
    setIsThumbnailSectionVisible(false);
    setUploadedMediaId(null);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }
    
    uploadFile(file);
  };

  // Handle custom thumbnail upload
  const handleCustomThumbnailUpload = async (thumbnailFile: File) => {
    try {
      // Create a URL for the file
      const imageUrl = URL.createObjectURL(thumbnailFile);
      
      // Set it as the selected thumbnail
      selectThumbnail(imageUrl);
      
      // Add it to the thumbnails array for display
      const timestamp = 0; // Custom thumbnail has no timestamp
      const newThumbnails = [...thumbnails, { url: imageUrl, timestamp }];
      
      // TODO: Upload the custom thumbnail to storage
      // This would normally be handled in the useThumbnailGenerator hook
      // For now, we'll just use the object URL for preview purposes
      
      toast({
        title: 'Custom thumbnail added',
        description: 'Your custom thumbnail has been added to the selection.',
      });
    } catch (error) {
      console.error('Error handling custom thumbnail:', error);
      toast({
        title: 'Error adding custom thumbnail',
        description: 'Failed to process your custom thumbnail',
        variant: 'destructive',
      });
    }
  };

  // Handle saving the thumbnail and completing the upload process
  const handleSaveThumbnailAndComplete = async () => {
    if (!uploadedMediaId) {
      toast({
        title: 'Error',
        description: 'No media ID found for saving thumbnail',
        variant: 'destructive',
      });
      return;
    }
    
    const success = await saveThumbnail(uploadedMediaId);
    
    if (success) {
      // Fetch the updated media data to pass to the completion handler
      const { data: mediaData, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', uploadedMediaId)
        .single();
      
      if (error) {
        console.error('Error fetching updated media:', error);
        toast({
          title: 'Error',
          description: 'Failed to complete the upload process',
          variant: 'destructive',
        });
        return;
      }
      
      // Complete the upload process
      onUploadComplete(mediaData);
      resetForm();
    }
  };

  // Skip thumbnail selection and complete using default
  const handleSkipThumbnailSelection = () => {
    // If there's a selected thumbnail already, use it
    if (selectedThumbnail && uploadedMediaId) {
      saveThumbnail(uploadedMediaId).then(() => {
        onUploadComplete({ id: uploadedMediaId });
        resetForm();
      });
    } else {
      // Otherwise just complete the process with whatever thumbnail was auto-generated
      onUploadComplete({ id: uploadedMediaId });
      resetForm();
    }
  };

  // Animation variants
  const uploadContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 100 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={!prefersReducedMotion ? uploadContainerVariants : {}}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {!file ? (
          <UploadPrompt 
            onFileSelect={() => fileInputRef.current?.click()} 
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FilePreview 
              file={file} 
              onRemove={() => setFile(null)} 
            />
            
            {uploadStatus === 'uploading' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            {uploadStatus === 'success' ? (
              isThumbnailSectionVisible ? (
                <div className="space-y-6">
                  <ThumbnailSelector 
                    thumbnails={thumbnails}
                    selectedThumbnail={selectedThumbnail}
                    isGenerating={isGenerating}
                    onSelect={selectThumbnail}
                    onUploadCustom={handleCustomThumbnailUpload}
                  />
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSkipThumbnailSelection}
                      className="border-white/10"
                    >
                      Skip
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleSaveThumbnailAndComplete}
                      className="bg-elvis-pink hover:bg-elvis-pink/80"
                      disabled={isGenerating || !selectedThumbnail}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save & Complete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="bg-elvis-darker p-4 rounded-lg flex items-center text-green-500">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Upload Completed Successfully</span>
                  </div>
                </div>
              )
            ) : uploadStatus === 'error' ? (
              <div className="flex justify-center">
                <div className="bg-elvis-darker p-4 rounded-lg flex items-center text-red-500">
                  <X className="mr-2 h-5 w-5" />
                  <span>Upload Failed. Please try again.</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFile(null)}
                  className="border-white/10"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-elvis-pink hover:bg-elvis-pink/80"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        )}
      </motion.div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*"
      />
    </div>
  );
};

export default FileUploadTab;
