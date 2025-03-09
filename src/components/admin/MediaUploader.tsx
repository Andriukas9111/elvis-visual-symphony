
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Camera, Film, Youtube } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { createMedia } from '@/lib/api';

interface MediaUploaderProps {
  onUploadComplete: (mediaData: any) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'youtube'>('file');
  const [youtubeData, setYoutubeData] = useState({
    url: '',
    title: '',
    description: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { prefersReducedMotion } = useAnimation();

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailFromYoutubeId = (id: string) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

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

  const handleYoutubeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setYoutubeData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadFile = async () => {
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
      
      // For larger files, we'll use a chunked upload approach
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const chunks = Math.ceil(file.size / chunkSize);
      
      if (file.size <= chunkSize) {
        // Small file, use standard upload
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true, // Allow file replacement
          });

        if (uploadError) throw uploadError;
      } else {
        // Large file, use chunked upload
        let uploadedBytes = 0;
        
        for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min((chunkIndex + 1) * chunkSize, file.size);
          const chunk = file.slice(start, end);
          
          const uploadOptions = {
            cacheControl: '3600',
            upsert: true
          };
          
          if (chunkIndex > 0) {
            // @ts-ignore - Supabase SDK types don't include offset option properly
            uploadOptions.offset = uploadedBytes;
          }
          
          const { error: chunkError } = await supabase.storage
            .from('media')
            .upload(filePath, chunk, uploadOptions);
            
          if (chunkError) throw chunkError;
          
          uploadedBytes += (end - start);
          setUploadProgress(15 + Math.round((uploadedBytes / file.size) * 45));
        }
      }
      
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
          url: urlData.publicUrl,
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

  const handleSubmitYoutube = async () => {
    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(30);

      const youtubeId = extractYoutubeId(youtubeData.url);
      
      if (!youtubeId) {
        throw new Error('Invalid YouTube URL');
      }
      
      const videoUrl = `https://www.youtube.com/embed/${youtubeId}`;
      const thumbnailUrl = getThumbnailFromYoutubeId(youtubeId);
      
      setUploadProgress(60);
      
      // Create a media entry in the database
      const mediaData = await createMedia({
        title: youtubeData.title || `YouTube Video ${youtubeId}`,
        slug: (youtubeData.title || `youtube-${youtubeId}`).toLowerCase().replace(/\s+/g, '-'),
        description: youtubeData.description,
        type: 'video',
        category: 'youtube',
        url: videoUrl,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        is_published: false,
        orientation: 'horizontal',
        tags: ['youtube']
      });

      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: 'YouTube video added',
        description: 'Your YouTube video has been added successfully.',
      });
      
      onUploadComplete(mediaData);
      
      // Reset the form after a successful upload
      setTimeout(() => {
        setYoutubeData({ url: '', title: '', description: '' });
        setIsUploading(false);
      }, 1500);
      
    } catch (error: any) {
      console.error('YouTube error:', error.message);
      setUploadStatus('error');
      toast({
        title: 'Failed to add YouTube video',
        description: error.message,
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

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
        <Tabs defaultValue="file" onValueChange={(value) => setUploadMethod(value as 'file' | 'youtube')}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload File</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              <span>YouTube URL</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file">
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
                    <motion.p 
                      className="text-xs text-white/40 mt-2"
                      variants={prefersReducedMotion ? {} : itemVariants}
                    >
                      Large files will be chunked for reliable uploads
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
                className="mt-4"
              >
                <Button 
                  className="w-full bg-elvis-pink hover:bg-elvis-pink/80 shadow-pink-glow/30 hover:shadow-pink-glow/50 transition-all duration-300"
                  onClick={handleUploadFile}
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
          </TabsContent>
          
          <TabsContent value="youtube">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  name="url"
                  value={youtubeData.url}
                  onChange={handleYoutubeInputChange}
                  placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                  className="bg-elvis-medium border-white/10"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  name="title"
                  value={youtubeData.title}
                  onChange={handleYoutubeInputChange}
                  placeholder="Title (optional)"
                  className="bg-elvis-medium border-white/10"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Textarea
                  name="description"
                  value={youtubeData.description}
                  onChange={handleYoutubeInputChange}
                  placeholder="Description (optional)"
                  className="bg-elvis-medium border-white/10 min-h-[80px]"
                  disabled={isUploading}
                />
              </div>
              
              {youtubeData.url && extractYoutubeId(youtubeData.url) && (
                <div className="mt-2">
                  <p className="text-sm text-white/60 mb-2">Preview:</p>
                  <img 
                    src={getThumbnailFromYoutubeId(extractYoutubeId(youtubeData.url)!)}
                    alt="YouTube Thumbnail"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              
              {uploadStatus === 'uploading' && (
                <div className="space-y-2">
                  <Progress 
                    value={uploadProgress} 
                    className="h-2 bg-elvis-medium" 
                  />
                  <div className="text-sm text-white/60 text-right">
                    {uploadProgress}%
                  </div>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <div className="flex items-center text-green-500 space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>YouTube video added</span>
                </div>
              )}
              
              {uploadStatus === 'error' && (
                <div className="flex items-center text-red-500 space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Failed to add YouTube video</span>
                </div>
              )}
              
              {uploadStatus !== 'success' && (
                <Button 
                  className="w-full bg-elvis-pink hover:bg-elvis-pink/80 shadow-pink-glow/30 hover:shadow-pink-glow/50 transition-all duration-300"
                  onClick={handleSubmitYoutube}
                  disabled={!youtubeData.url || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" />
                      Add YouTube Video
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default MediaUploader;
