
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

interface TestimonialCarouselProps {
  testimonials: any[];
}

const TRANSITION_DURATION = 0.5;
const AUTO_ROTATE_INTERVAL = 10000;
const QUOTE_CHARACTER_LIMIT = 120;

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(true);

  // Get the visible testimonials based on current index
  const visibleTestimonials = useMemo(() => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push({
        ...testimonials[index],
        position: i // 0=left, 1=center, 2=right
      });
    }
    return result;
  }, [currentIndex, testimonials]);

  // Handle manual navigation
  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || testimonials.length <= 3) return;
    
    setIsAnimating(true);
    
    if (direction === 'next') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    }
    
    // Reset auto-rotation when manually navigating
    setAutoRotateEnabled(false);
    
    // Allow animations to complete before enabling navigation again
    setTimeout(() => {
      setIsAnimating(false);
      setAutoRotateEnabled(true);
    }, TRANSITION_DURATION * 1000);
  }, [isAnimating, testimonials.length]);

  // Auto rotate testimonials
  useEffect(() => {
    if (!autoRotateEnabled) return;
    
    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        
        // Allow animations to complete before enabling navigation again
        setTimeout(() => {
          setIsAnimating(false);
        }, TRANSITION_DURATION * 1000);
      }
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [testimonials.length, autoRotateEnabled, isAnimating]);

  // Animation variants for each position
  const variants = {
    left: {
      x: 0,
      opacity: 0.7,
      scale: 0.8,
      zIndex: 0,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 2,
    },
    right: {
      x: 0,
      opacity: 0.7,
      scale: 0.8,
      zIndex: 0,
    },
    exitLeft: {
      x: -100,
      opacity: 0,
      scale: 0.6,
      zIndex: -1,
    },
    exitRight: {
      x: 100,
      opacity: 0,
      scale: 0.6,
      zIndex: -1,
    },
    initial: (position: number) => {
      return position === 0 ? { x: -100, opacity: 0, scale: 0.6, zIndex: -1 } : 
             position === 2 ? { x: 100, opacity: 0, scale: 0.6, zIndex: -1 } :
             { x: 0, opacity: 0, scale: 0.6, zIndex: -1 };
    }
  };

  // Helper to truncate text
  const truncateText = (text: string) => {
    if (!text) return '';
    if (text.length <= QUOTE_CHARACTER_LIMIT) return text;
    return text.substring(0, QUOTE_CHARACTER_LIMIT) + '...';
  };

  return (
    <>
      <div className="relative">
        {/* Navigation buttons */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button 
            onClick={() => navigate('prev')} 
            disabled={isAnimating}
            variant="ghost" 
            size="icon"
            className="text-white/60 hover:text-white hover:bg-elvis-pink/20"
          >
            <ChevronLeft />
          </Button>
        </div>
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Button 
            onClick={() => navigate('next')} 
            disabled={isAnimating}
            variant="ghost" 
            size="icon"
            className="text-white/60 hover:text-white hover:bg-elvis-pink/20"
          >
            <ChevronRight />
          </Button>
        </div>
        
        {/* Testimonial cards */}
        <div className="flex justify-center items-center py-16 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleTestimonials.map((testimonial) => {
              const position = testimonial.position;
              const positionClass = 
                position === 0 ? "-translate-x-1/4" :
                position === 2 ? "translate-x-1/4" : "";
              
              // Calculate if we need a "Read More" button
              const needsReadMore = testimonial.quote && testimonial.quote.length > QUOTE_CHARACTER_LIMIT;
              const truncatedQuote = truncateText(testimonial.quote);
              
              return (
                <motion.div
                  key={`${testimonial.id}-${position}`}
                  custom={position}
                  variants={variants}
                  initial="initial"
                  animate={
                    position === 0 ? "left" :
                    position === 1 ? "center" : "right"
                  }
                  exit={position === 0 ? "exitLeft" : "exitRight"}
                  transition={{
                    duration: TRANSITION_DURATION,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className={cn(
                    "absolute transform transition-all",
                    positionClass,
                    position === 1 ? "z-10 w-[400px]" : "w-[300px]"
                  )}
                >
                  <div className={cn(
                    "rounded-xl p-6 transition-all border border-white/5 bg-gradient-to-br from-[#D3E4FD]/10 to-[#E5DEFF]/5",
                    position === 1 ? "shadow-md" : ""
                  )}>
                    <div className="flex flex-col h-full min-h-[240px]">
                      <div className="mb-3 flex justify-between items-start">
                        <Quote className="text-elvis-pink h-5 w-5 opacity-80" />
                        <div className="flex">
                          {[...Array(testimonial.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-elvis-pink/70 fill-elvis-pink/70" />
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-white/80 text-sm italic mb-4 flex-grow leading-relaxed">
                        <p>"{truncatedQuote}"</p>
                        {needsReadMore && (
                          <Button
                            variant="link"
                            onClick={() => setSelectedTestimonial(testimonial)}
                            className="text-elvis-pink pl-1 h-auto p-0 text-xs font-normal mt-1"
                          >
                            Read More
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-auto pt-3 border-t border-white/10">
                        <div className="w-8 h-8 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold text-xs">
                          {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div className="ml-3">
                          <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
                          <p className="text-white/60 text-xs">
                            {testimonial.position}
                            {testimonial.company ? `, ${testimonial.company}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Testimonial detail dialog */}
      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="bg-elvis-darker border-elvis-dark max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Client Testimonial</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedTestimonial && (
              <>
                <div className="flex justify-center items-center mb-5">
                  <div className="flex">
                    {[...Array(selectedTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-elvis-pink/80 fill-elvis-pink/80" />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mb-6">
                  <Quote className="text-elvis-pink h-10 w-10 opacity-70" />
                </div>
                
                <p className="text-white/90 italic text-base leading-relaxed text-center mb-6">
                  "{selectedTestimonial.quote}"
                </p>
                
                <div className="flex items-center justify-center pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold">
                    {selectedTestimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white font-medium">{selectedTestimonial.name}</h4>
                    <p className="text-white/60 text-sm">
                      {selectedTestimonial.position}{selectedTestimonial.company ? `, ${selectedTestimonial.company}` : ''}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TestimonialCarousel;
