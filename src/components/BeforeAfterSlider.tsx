
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatio?: number; // e.g., 16/9
  interactive?: boolean;
}

const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
  aspectRatio = 16/9,
  interactive = true,
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    if (interactive) isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = () => {
    if (interactive) isDragging.current = true;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current || !isDragging.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const relativeX = clientX - containerRect.left;
    
    // Calculate percentage (0-100)
    let percentage = (relativeX / containerWidth) * 100;
    
    // Clamp between 0 and 100
    percentage = Math.min(Math.max(percentage, 0), 100);
    
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      updateSliderPosition(e.touches[0].clientX);
    }
  };

  // Add document level event listeners to handle dragging outside the component
  useEffect(() => {
    const handleDocumentMouseUp = () => {
      isDragging.current = false;
    };

    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        updateSliderPosition(e.clientX);
      }
    };

    const handleDocumentTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches.length > 0) {
        updateSliderPosition(e.touches[0].clientX);
      }
    };

    const handleDocumentTouchEnd = () => {
      isDragging.current = false;
    };

    document.addEventListener('mouseup', handleDocumentMouseUp);
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('touchmove', handleDocumentTouchMove, { passive: true });
    document.addEventListener('touchend', handleDocumentTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleDocumentMouseUp);
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('touchmove', handleDocumentTouchMove);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn("relative select-none overflow-hidden rounded-lg", className)}
      style={{ aspectRatio: aspectRatio }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image (Full Width) */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={beforeImage} 
          alt={beforeLabel} 
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black/70 px-2 py-1 text-xs text-white rounded">
          {beforeLabel}
        </div>
      </div>

      {/* After Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt={afterLabel} 
          className="absolute h-full w-full object-cover"
          style={{ 
            width: `${100 / (sliderPosition / 100)}%`,
            maxWidth: `${100 / (sliderPosition / 100)}%`,
            right: 0 
          }}
        />
        <div className="absolute bottom-4 left-4 bg-black/70 px-2 py-1 text-xs text-white rounded">
          {afterLabel}
        </div>
      </div>

      {/* Slider Handle */}
      <motion.div 
        className="absolute top-0 bottom-0 z-10 cursor-ew-resize"
        style={{ left: `calc(${sliderPosition}% - 2px)`, width: '4px' }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1.1 }}
      >
        <div className="h-full w-full bg-elvis-pink"></div>
        
        {/* Slider Knob */}
        <div 
          className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-elvis-pink shadow-pink-glow flex items-center justify-center"
        >
          <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-white"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BeforeAfterSlider;
