
import React from 'react';
import { Loader2 } from 'lucide-react';

const BufferOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
      <Loader2 className="h-10 w-10 text-white animate-spin" />
    </div>
  );
};

export default BufferOverlay;
