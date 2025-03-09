
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Camera, Film } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';

interface MediaUploaderProps {
  onUploadComplete: (mediaData: any) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { prefersReducedMotion } = useAnimation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadStatus('idle');
      setUploadProgress(0);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
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
      
      // Simulate the start of upload with a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      setUploadProgress(15);
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      
      // Simulate processing time for better UX
      setUploadProgress(60);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setUploadProgress(80);
      await new Promise(resolve => setTimeout(resolve, 200));

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

  // Auto-upload when file is selected (optional feature)
  // useEffect(() => {
  //   if (file && uploadStatus === 'idle') {
  //     handleUpload();
  //   }
  // }, [file]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }
    }
  };

  return (
    <div className="p-6 bg-elvis-light rounded-lg border border-white/10 shadow-pink-glow/10 hover:shadow-pink-glow/20 transition-all duration-500">
      <motion.div 
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={prefersReducedMotion ? {} : containerVariants}
      >
        <motion.div 
          className={`flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 cursor-pointer hover:border-elvis-pink/50 transition-all duration-300 ${previewUrl ? 'hover:shadow-pink-glow/10' : ''}`}
          variants={prefersReducedMotion ? {} : itemVariants}
          whileHover={{ scale: 1.01 }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="upload-prompt"
                className="flex flex-col items-center"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={prefersReducedMotion ? {} : containerVariants}
              >
                <motion.div 
                  className="h-12 w-12 text-white/40 mb-2 rounded-full bg-elvis-medium p-3 flex items-center justify-center"
                  variants={prefersReducedMotion ? {} : itemVariants}
                  whileHover={{ 
                    rotate: [0, -10, 10, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <Upload className="h-6 w-6" />
                </motion.div>
                <motion.p 
                  className="text-lg font-medium"
                  variants={prefersReducedMotion ? {} : itemVariants}
                >
                  Drop files here or click to upload
                </motion.p>
                <motion.p 
                  className="text-sm text-white/60 mt-1"
                  variants={prefersReducedMotion ? {} : itemVariants}
                >
                  <span className="inline-flex items-center mr-2">
                    <Camera className="h-3 w-3 mr-1" /> Images
                  </span>
                  <span className="inline-flex items-center">
                    <Film className="h-3 w-3 mr-1" /> Videos
                  </span>
                </motion.p>
              </motion.div>
            ) : (
              <motion.div 
                key="file-preview"
                className="w-full"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={prefersReducedMotion ? {} : containerVariants}
              >
                <div className="flex justify-between items-center mb-3">
                  <motion.div 
                    className="flex items-center space-x-2"
                    variants={prefersReducedMotion ? {} : itemVariants}
                  >
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-white/60">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  </motion.div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-elvis-pink/10 hover:text-elvis-pink transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {previewUrl && (
                  <motion.div 
                    className="mb-3 overflow-hidden rounded-md"
                    variants={prefersReducedMotion ? {} : itemVariants}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                )}
                
                {uploadStatus === 'uploading' && (
                  <motion.div 
                    className="space-y-2"
                    variants={prefersReducedMotion ? {} : itemVariants}
                  >
                    <Progress 
                      value={uploadProgress} 
                      className="h-2 bg-elvis-medium" 
                    />
                    <div className="text-sm text-white/60 text-right">
                      {uploadProgress}%
                    </div>
                  </motion.div>
                )}

                {uploadStatus === 'success' && (
                  <motion.div 
                    className="flex items-center text-green-500 space-x-2"
                    variants={prefersReducedMotion ? {} : successVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Upload complete</span>
                  </motion.div>
                )}

                {uploadStatus === 'error' && (
                  <motion.div 
                    className="flex items-center text-red-500 space-x-2"
                    variants={prefersReducedMotion ? {} : itemVariants}
                  >
                    <AlertCircle className="h-5 w-5" />
                    <span>Upload failed</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {file && uploadStatus !== 'success' && (
          <motion.div
            variants={prefersReducedMotion ? {} : itemVariants}
          >
            <Button 
              className="w-full bg-elvis-pink hover:bg-elvis-pink/80 shadow-pink-glow/30 hover:shadow-pink-glow/50 transition-all duration-300"
              onClick={handleUpload}
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
                  Upload File
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MediaUploader;
