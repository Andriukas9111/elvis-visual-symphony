
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ChunkedVideoLoadingProps {
  loadingProgress: number;
}

const ChunkedVideoLoading: React.FC<ChunkedVideoLoadingProps> = ({ loadingProgress }) => {
  return (
    <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 text-elvis-pink animate-spin mb-2" />
      <p className="text-white/70">Loading chunked video...</p>
      <div className="w-2/3 mt-4">
        <Progress value={loadingProgress} className="h-2" />
      </div>
    </div>
  );
};

export default ChunkedVideoLoading;
