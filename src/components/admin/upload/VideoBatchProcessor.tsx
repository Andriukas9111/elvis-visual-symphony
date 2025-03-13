
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, Check, X } from 'lucide-react';
import { testVideoPlayback } from '@/components/portfolio/video-player/utils';

interface VideoBatchProcessorProps {
  videos: File[];
  onBatchComplete: (processedVideos: any[]) => void;
  onCancel: () => void;
}

interface ProcessingResult {
  file: File;
  success: boolean;
  error?: string;
  data?: any;
}

const VideoBatchProcessor: React.FC<VideoBatchProcessorProps> = ({
  videos,
  onBatchComplete,
  onCancel
}) => {
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const { toast } = useToast();

  const processVideo = useCallback(async (file: File): Promise<{ success: boolean; error?: string; data?: any }> => {
    try {
      // Create a temporary URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Test if the video can be played
      const canPlay = await testVideoPlayback(fileUrl);
      
      // Clean up the temporary URL
      URL.revokeObjectURL(fileUrl);
      
      if (!canPlay) {
        return { 
          success: false, 
          error: 'Video format is not supported or corrupted' 
        };
      }
      
      // Simulated video processing result
      // In a real implementation, this would upload to storage, generate thumbnails, etc.
      return { 
        success: true, 
        data: {
          file,
          title: file.name.split('.')[0],
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          // Add any other processed data here
        }
      };
    } catch (error) {
      console.error('Error processing video:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error processing video' 
      };
    }
  }, []);

  const processNext = useCallback(async () => {
    if (currentIndex >= videos.length) {
      setIsProcessing(false);
      
      // Notify parent with successful results
      const successfulResults = results.filter(r => r.success).map(r => r.data);
      onBatchComplete(successfulResults);
      return;
    }
    
    setIsProcessing(true);
    const file = videos[currentIndex];
    
    try {
      // Process the video
      const result = await processVideo(file);
      
      // Update results
      setResults(prev => [...prev, { file, ...result }]);
      
      // Update progress
      const newProgress = Math.round(((currentIndex + 1) / videos.length) * 100);
      setProgress(newProgress);
      
      // Move to next video
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error in batch processing:', error);
      
      // Add failed result
      setResults(prev => [...prev, { 
        file, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }]);
      
      // Move to next video
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, videos, results, processVideo, onBatchComplete]);

  // Start or continue processing when index changes
  useEffect(() => {
    if (isProcessing) {
      processNext();
    }
  }, [currentIndex, isProcessing, processNext]);

  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentIndex(0);
    setResults([]);
    setProgress(0);
  };

  const handleCancel = () => {
    setIsProcessing(false);
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Batch Processing Videos ({videos.length} files)
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="text-sm text-muted-foreground">
        {isProcessing 
          ? `Processing ${currentIndex + 1} of ${videos.length}...` 
          : `Ready to process ${videos.length} videos`}
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`flex items-center p-2 rounded-md ${
              result.success ? 'bg-green-950/20' : 'bg-red-950/20'
            }`}
          >
            {result.success ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className="truncate flex-1">{result.file.name}</span>
            {result.error && (
              <span className="text-xs text-red-400 ml-2">{result.error}</span>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isProcessing}
          className="border-white/10"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={startProcessing}
          disabled={isProcessing || videos.length === 0}
          className="bg-elvis-pink hover:bg-elvis-pink/80"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Process Videos'
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoBatchProcessor;
