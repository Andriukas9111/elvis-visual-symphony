
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Image as ImageIcon, 
  Film, 
  Check, 
  Loader2, 
  Upload, 
  RefreshCw 
} from 'lucide-react';
import { useThumbnailGenerator } from '@/hooks/admin/upload/useThumbnailGenerator';
import { useAnimation } from '@/contexts/AnimationContext';

interface ThumbnailGeneratorProps {
  videoFile: File | null;
  videoUrl?: string;
  videoId?: string;
  onThumbnailSelected: (url: string, isVertical?: boolean) => void;
}

const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({
  videoFile,
  videoUrl,
  videoId,
  onThumbnailSelected
}) => {
  const { 
    thumbnails, 
    isGenerating, 
    selectedThumbnail,
    selectedThumbnailIsVertical,
    generationProgress,
    generateThumbnails, 
    selectThumbnail,
    uploadCustomThumbnail
  } = useThumbnailGenerator();
  const { prefersReducedMotion } = useAnimation();
  const [showUploadArea, setShowUploadArea] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
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

  const handleGenerate = async () => {
    if (!videoFile && !videoUrl) return;
    
    const generatedThumbnails = await generateThumbnails(
      videoFile as File, 
      videoUrl, 
      videoId
    );
    
    if (generatedThumbnails.length > 0 && generatedThumbnails[0].url) {
      onThumbnailSelected(
        generatedThumbnails[0].url, 
        generatedThumbnails[0].isVertical
      );
    }
  };

  const handleSelect = (url: string, isVertical: boolean = false) => {
    selectThumbnail(url, isVertical);
    onThumbnailSelected(url, isVertical);
  };

  const handleUploadClick = () => {
    setShowUploadArea(!showUploadArea);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const thumbnailUrl = await uploadCustomThumbnail(file);
      if (thumbnailUrl) {
        onThumbnailSelected(thumbnailUrl, selectedThumbnailIsVertical);
      }
    }
  };

  return (
    <div className="w-full space-y-4 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium">Video Thumbnails</div>
        
        <div className="flex space-x-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-white/10 hover:bg-elvis-pink/20"
            disabled={isGenerating || (!videoFile && !videoUrl)}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : thumbnails.length > 0 ? (
              <>
                <RefreshCw className="mr-2 h-3 w-3" />
                Regenerate
              </>
            ) : (
              <>
                <Film className="mr-2 h-3 w-3" />
                Generate from Video
              </>
            )}
          </Button>
          
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-white/10 hover:bg-elvis-pink/20"
            onClick={handleUploadClick}
          >
            <Upload className="mr-2 h-3 w-3" />
            Upload Custom
          </Button>
        </div>
      </div>
      
      {isGenerating && (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Progress value={generationProgress} className="h-2 bg-elvis-medium" />
          <p className="text-xs text-white/60">
            {generationProgress < 30 
              ? 'Preparing thumbnail generation...' 
              : generationProgress < 70
                ? 'Generating thumbnails from video frames...'
                : 'Processing and uploading thumbnails...'}
          </p>
        </motion.div>
      )}
      
      {showUploadArea && (
        <motion.div 
          className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-white/40" />
          <p className="text-sm text-white/70 mb-2">Drag and drop a thumbnail image here or click to browse</p>
          <Button 
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Image
          </Button>
        </motion.div>
      )}
      
      {thumbnails.length > 0 && (
        <motion.div
          className="space-y-3"
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {thumbnails.map((thumb, index) => (
              <motion.div
                key={index}
                className={`relative ${thumb.isVertical ? 'aspect-[9/16]' : 'aspect-video'} rounded-md overflow-hidden border-2 cursor-pointer 
                  ${selectedThumbnail === thumb.url 
                    ? 'border-elvis-pink shadow-pink-glow' 
                    : 'border-transparent hover:border-white/30'}`}
                variants={prefersReducedMotion ? {} : itemVariants}
                onClick={() => handleSelect(thumb.url, !!thumb.isVertical)}
              >
                <img 
                  src={thumb.url} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                
                {selectedThumbnail === thumb.url && (
                  <div className="absolute top-1 right-1 bg-elvis-pink/80 rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                
                {thumb.timestamp > 0 && (
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                    {formatTime(thumb.timestamp)}
                  </div>
                )}
                
                {thumb.isVertical && (
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                    Vertical
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <p className="text-xs text-white/60">
            Click on a thumbnail to select it as the video preview image
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default ThumbnailGenerator;
