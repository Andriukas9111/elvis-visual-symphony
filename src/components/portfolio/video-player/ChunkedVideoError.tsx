
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ChunkedVideoErrorProps {
  errorMessage: string;
}

const ChunkedVideoError: React.FC<ChunkedVideoErrorProps> = ({ errorMessage }) => {
  return (
    <div className="relative overflow-hidden rounded-xl aspect-video bg-elvis-darker flex items-center justify-center">
      <div className="flex flex-col items-center text-center px-4">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
        <h3 className="text-lg font-medium text-white mb-1">Video Playback Error</h3>
        <p className="text-white/70 text-sm">{errorMessage || 'Failed to load chunked video'}</p>
      </div>
    </div>
  );
};

export default ChunkedVideoError;
