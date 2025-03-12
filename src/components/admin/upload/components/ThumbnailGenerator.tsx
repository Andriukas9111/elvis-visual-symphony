
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useThumbnailGenerator } from '@/hooks/admin/upload/useThumbnailGenerator';
import { useAnimation } from '@/contexts/AnimationContext';
import ThumbnailGrid from './ThumbnailGenerator/ThumbnailGrid';
import GenerationProgress from './ThumbnailGenerator/GenerationProgress';
import CustomUploadArea from './ThumbnailGenerator/CustomUploadArea';
import ActionButtons from './ThumbnailGenerator/ActionButtons';

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

  // Animation variants
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

  const hasVideoSource = !!videoFile || !!videoUrl;

  return (
    <div className="w-full space-y-4 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium">Video Thumbnails</div>
        
        <ActionButtons 
          isGenerating={isGenerating}
          thumbnailsExist={thumbnails.length > 0}
          hasVideoSource={hasVideoSource}
          onGenerate={handleGenerate}
          onUploadClick={handleUploadClick}
        />
      </div>
      
      <GenerationProgress 
        isGenerating={isGenerating}
        generationProgress={generationProgress}
      />
      
      <CustomUploadArea
        showUploadArea={showUploadArea}
        onFileSelect={handleFileSelect}
      />
      
      <ThumbnailGrid
        thumbnails={thumbnails}
        selectedThumbnail={selectedThumbnail}
        itemVariants={itemVariants}
        prefersReducedMotion={prefersReducedMotion}
        onSelectThumbnail={handleSelect}
      />
    </div>
  );
};

export default ThumbnailGenerator;
