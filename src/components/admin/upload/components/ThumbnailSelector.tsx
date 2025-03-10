
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Upload, Check } from 'lucide-react';
import { useAnimation } from '@/contexts/AnimationContext';
import { Button } from '@/components/ui/button';

interface ThumbnailSelectorProps {
  thumbnails: Array<{ url: string; timestamp: number }>;
  selectedThumbnail: string | null;
  isGenerating: boolean;
  onSelect: (url: string) => void;
  onUploadCustom: (file: File) => void;
}

const ThumbnailSelector: React.FC<ThumbnailSelectorProps> = ({
  thumbnails,
  selectedThumbnail,
  isGenerating,
  onSelect,
  onUploadCustom
}) => {
  const { prefersReducedMotion } = useAnimation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Format timestamp to MM:SS
  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const thumbnailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadCustom(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-white">Video Thumbnails</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="border-white/10 hover:border-elvis-pink/50"
        >
          <Upload className="mr-2 h-4 w-4" />
          Custom Thumbnail
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 text-elvis-pink animate-spin mb-4" />
          <p className="text-white/70 text-sm">Generating thumbnails from your video...</p>
        </div>
      ) : thumbnails.length === 0 ? (
        <div className="bg-elvis-darker border border-white/10 rounded-lg p-6 text-center">
          <p className="text-white/70">Thumbnails will be generated automatically from your video.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          variants={!prefersReducedMotion ? containerVariants : {}}
          initial="hidden"
          animate="visible"
        >
          {thumbnails.map((thumbnail, index) => (
            <motion.div 
              key={index} 
              className="relative group"
              variants={!prefersReducedMotion ? thumbnailVariants : {}}
            >
              <div 
                className={`
                  relative aspect-video overflow-hidden rounded-md cursor-pointer border-2 
                  ${selectedThumbnail === thumbnail.url ? 'border-elvis-pink' : 'border-transparent hover:border-white/30'}
                  transition-all duration-200
                `}
                onClick={() => onSelect(thumbnail.url)}
              >
                <img 
                  src={thumbnail.url} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {selectedThumbnail === thumbnail.url && (
                  <div className="absolute top-2 right-2 bg-elvis-pink rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                  {formatTimestamp(thumbnail.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ThumbnailSelector;
