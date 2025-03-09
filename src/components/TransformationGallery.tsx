
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

interface TransformationExample {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

interface TransformationGalleryProps {
  examples: TransformationExample[];
}

const TransformationGallery = ({ examples }: TransformationGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? examples.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === examples.length - 1 ? 0 : prev + 1));
  };

  const handleShare = (id: string) => {
    const currentUrl = window.location.href;
    const shareUrl = new URL(currentUrl);
    shareUrl.searchParams.set('example', id);

    navigator.clipboard.writeText(shareUrl.toString())
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Share link has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to copy link",
          description: "Please try again",
        });
      });
  };

  const currentExample = examples[activeIndex];

  return (
    <div className="my-8 overflow-hidden rounded-xl bg-elvis-medium p-1 shadow-pink-glow">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExample.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <BeforeAfterSlider
              beforeImage={currentExample.beforeImage}
              afterImage={currentExample.afterImage}
              aspectRatio={16/9}
              className="w-full"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <button 
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-elvis-dark/60 p-2 text-white hover:bg-elvis-dark transition-colors"
          aria-label="Previous example"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-elvis-dark/60 p-2 text-white hover:bg-elvis-dark transition-colors"
          aria-label="Next example"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{currentExample.title}</h3>
            <p className="text-gray-300">{currentExample.description}</p>
          </div>
          <Button 
            onClick={() => handleShare(currentExample.id)}
            variant="ghost" 
            size="icon"
            className="group relative"
          >
            <Share2 className="h-5 w-5" />
            <span className="absolute -top-8 right-0 hidden rounded bg-elvis-dark p-1 text-xs text-white group-hover:block">
              Share
            </span>
          </Button>
        </div>
        
        <div className="mt-4 flex justify-center gap-1">
          {examples.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === activeIndex ? 'bg-elvis-pink' : 'bg-gray-600'
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to example ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransformationGallery;
