
import React from 'react';

interface ChunkIndicatorProps {
  currentChunk: number;
  totalChunks: number;
}

const ChunkIndicator: React.FC<ChunkIndicatorProps> = ({ currentChunk, totalChunks }) => {
  if (totalChunks <= 1) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white z-20">
      Chunk {currentChunk + 1}/{totalChunks}
    </div>
  );
};

export default ChunkIndicator;
