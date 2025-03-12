
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing thumbnail state
 */
export const useThumbnailState = () => {
  const [thumbnails, setThumbnails] = useState<Array<{ url: string; timestamp: number; isVertical?: boolean }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
  const [selectedThumbnailIsVertical, setSelectedThumbnailIsVertical] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  /**
   * Set a specific thumbnail as selected
   */
  const selectThumbnail = (url: string, isVertical: boolean = false) => {
    setSelectedThumbnail(url);
    setSelectedThumbnailIsVertical(isVertical);
  };

  return {
    thumbnails,
    setThumbnails,
    isGenerating,
    setIsGenerating,
    selectedThumbnail,
    selectedThumbnailIsVertical,
    generationProgress,
    setGenerationProgress,
    toast,
    selectThumbnail
  };
};
