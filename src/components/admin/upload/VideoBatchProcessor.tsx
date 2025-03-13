
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { testVideoPlayback } from '@/components/portfolio/video-player/utils';

export interface VideoBatchProcessorProps {
  onComplete: () => void; // Add this prop definition
}

const VideoBatchProcessor: React.FC<VideoBatchProcessorProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const { toast } = useToast();
  
  const processVideos = async () => {
    try {
      setIsProcessing(true);
      setResults({ success: 0, failed: 0 });
      
      // Simulate processing for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set mock results
      setResults({ success: 5, failed: 2 });
      
      toast({
        title: "Processing complete",
        description: `Successfully processed 5 videos with 2 failures.`,
      });
      
      // Notify parent component that processing is complete
      onComplete();
    } catch (error) {
      console.error('Error processing videos:', error);
      toast({
        title: "Processing failed",
        description: "An error occurred while processing videos.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 border border-white/10 rounded-lg bg-elvis-light">
        <h3 className="text-lg font-medium mb-3">Video Batch Processor</h3>
        <p className="text-white/70 mb-4">
          Process all uploaded videos to generate thumbnails, check for errors, and update metadata.
        </p>
        
        {results.success > 0 || results.failed > 0 ? (
          <div className="mb-4 p-4 bg-elvis-medium rounded-md">
            <div className="flex items-center mb-2">
              <Check className="h-5 w-5 text-green-400 mr-2" />
              <span>{results.success} videos processed successfully</span>
            </div>
            {results.failed > 0 && (
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                <span>{results.failed} videos had processing errors</span>
              </div>
            )}
          </div>
        ) : null}
        
        <Button 
          onClick={processVideos} 
          disabled={isProcessing}
          className="w-full bg-elvis-pink hover:bg-elvis-pink-dark"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing Videos..." : "Process All Videos"}
        </Button>
      </div>
    </div>
  );
};

export default VideoBatchProcessor;
