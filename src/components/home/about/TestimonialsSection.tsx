
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { fallbackTestimonials } from './fallbackTestimonials';
import { cn } from '@/lib/utils';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const { data: testimonials, isLoading, error } = useTestimonials();
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("right");
  
  const displayTestimonials = React.useMemo(() => {
    const baseTestimonials = testimonials && testimonials.length > 0
      ? testimonials
      : fallbackTestimonials;

    return baseTestimonials.slice(0, 6).map(item => ({
      id: item.id,
      name: item.author || '',
      position: item.role?.split(',')[0]?.trim() || '',
      company: item.role?.split(',')[1]?.trim() || '',
      quote: item.content || '',
      avatar: '',
      is_featured: item.featured || false,
      rating: item.rating || 5
    }));
  }, [testimonials]);

  useEffect(() => {
    if (!isPaused && isInView && !isAnimating) {
      const interval = setInterval(() => {
        handleNext();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [displayTestimonials.length, isPaused, isInView, isAnimating, activeIndex]);

  const handlePrevious = () => {
    if (isAnimating) return;
    setDirection("left");
    setIsAnimating(true);
    setActiveIndex((current) => 
      current === 0 ? displayTestimonials.length - 1 : current - 1
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setDirection("right");
    setIsAnimating(true);
    setActiveIndex((current) => 
      (current + 1) % displayTestimonials.length
    );
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="grid place-items-center h-96">
        <div className="w-full max-w-4xl">
          <div className="bg-elvis-dark/40 rounded-xl p-6 animate-pulse h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-white/80">Unable to load testimonials.</p>
      </div>
    );
  }

  const getVisibleIndices = () => {
    const prevIndex = activeIndex === 0 ? displayTestimonials.length - 1 : activeIndex - 1;
    const nextIndex = (activeIndex + 1) % displayTestimonials.length;
    return [prevIndex, activeIndex, nextIndex];
  };

  const [prevIndex, currentIndex, nextIndex] = getVisibleIndices();

  const cardVariants = {
    left: {
      x: '-30%',
      scale: 0.85,
      opacity: 0.5,
      rotateY: 15,
      zIndex: 0,
    },
    center: {
      x: '0%',
      scale: 1,
      opacity: 1,
      rotateY: 0,
      zIndex: 2,
    },
    right: {
      x: '30%',
      scale: 0.85,
      opacity: 0.5,
      rotateY: -15,
      zIndex: 0,
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? '-100%' : '100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'left' ? 30 : -30,
      zIndex: -1,
    }),
    enter: (direction: string) => ({
      x: direction === 'left' ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
      rotateY: direction === 'left' ? -30 : 30,
      zIndex: -1,
    }),
  };

  return (
    <div className="py-12 bg-elvis-darker min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <h3 className="text-3xl font-bold mb-20 flex items-center gap-3">
        <div className="w-1 h-8 bg-elvis-pink"></div>
        Client Testimonials
      </h3>
      
      <div 
        className="relative w-full max-w-7xl mx-auto h-[400px]"
        style={{ perspective: '1500px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative h-full">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {[prevIndex, currentIndex, nextIndex].map((index, position) => (
              <motion.div
                key={`${displayTestimonials[index].id}-${position}`}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate={position === 0 ? 'left' : position === 1 ? 'center' : 'right'}
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full max-w-lg"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={cn(
                  "p-8 rounded-xl bg-gradient-to-br from-elvis-dark/90 to-elvis-darker/90 border border-white/10",
                  "backdrop-blur-sm shadow-xl",
                  position === 1 ? "scale-110" : "scale-90"
                )}>
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="text-elvis-pink h-8 w-8 opacity-80" />
                    <div className="flex gap-0.5">
                      {[...Array(displayTestimonials[index].rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-elvis-pink/80 fill-elvis-pink/80" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-white/90 text-lg italic mb-8 leading-relaxed">
                    "{displayTestimonials[index].quote.length > 150 
                      ? `${displayTestimonials[index].quote.substring(0, 150)}...`
                      : displayTestimonials[index].quote}"
                    {displayTestimonials[index].quote.length > 150 && (
                      <Button
                        variant="link"
                        onClick={() => setSelectedTestimonial(displayTestimonials[index])}
                        className="text-elvis-pink pl-1 h-auto p-0"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </p>
                  
                  <div className="flex items-center border-t border-white/10 pt-4">
                    <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold">
                      {displayTestimonials[index].name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-medium">{displayTestimonials[index].name}</h4>
                      <p className="text-white/60 text-sm">
                        {displayTestimonials[index].position}
                        {displayTestimonials[index].company && `, ${displayTestimonials[index].company}`}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4 mt-8">
          <button 
            onClick={handlePrevious}
            className="p-2 rounded-full bg-elvis-dark/60 hover:bg-elvis-dark border border-white/10 text-white/80 hover:text-white transition-colors"
            disabled={isAnimating}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1.5">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return;
                  const newDirection = index > activeIndex ? "right" : "left";
                  setDirection(newDirection);
                  setIsAnimating(true);
                  setActiveIndex(index);
                  setTimeout(() => {
                    setIsAnimating(false);
                  }, 600);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-elvis-pink/90 w-4' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                disabled={isAnimating}
              />
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            className="p-2 rounded-full bg-elvis-dark/60 hover:bg-elvis-dark border border-white/10 text-white/80 hover:text-white transition-colors"
            disabled={isAnimating}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

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
                    {[...Array(selectedTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-elvis-pink/80 fill-elvis-pink/80" />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mb-6">
                  <Quote className="text-elvis-pink h-10 w-10 opacity-70" />
                </div>
                
                <p className="text-white/90 italic text-lg leading-relaxed text-center mb-6">
                  "{selectedTestimonial.quote}"
                </p>
                
                <div className="flex items-center justify-center pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold">
                    {selectedTestimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white font-medium">{selectedTestimonial.name}</h4>
                    <p className="text-white/60 text-sm">
                      {selectedTestimonial.position}
                      {selectedTestimonial.company && `, ${selectedTestimonial.company}`}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsSection;
