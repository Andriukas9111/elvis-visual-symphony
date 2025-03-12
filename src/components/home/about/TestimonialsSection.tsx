
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
  
  // Make sure we always have exactly 6 testimonials to display
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

  // Auto-advance testimonials every 10 seconds
  useEffect(() => {
    if (!isPaused && isInView && !isAnimating) {
      const interval = setInterval(() => {
        handleNext();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [displayTestimonials.length, isPaused, isInView, isAnimating, activeIndex]);

  const truncateText = (text: string, limit: number) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

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

  // Generate random pastel colors for testimonial cards
  const getRandomPastelColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-[#FEC6A1]/10 to-[#FDE1D3]/5',
      'bg-gradient-to-br from-[#D3E4FD]/10 to-[#E5DEFF]/5',
      'bg-gradient-to-br from-[#FFDEE2]/10 to-[#F1F0FB]/5',
      'bg-gradient-to-br from-[#F2FCE2]/10 to-[#E5DEFF]/5',
      'bg-gradient-to-br from-[#FEF7CD]/10 to-[#FDE1D3]/5',
      'bg-gradient-to-br from-[#E5DEFF]/10 to-[#D3E4FD]/5',
    ];
    return colors[index % colors.length];
  };

  // Calculate indices for the three visible testimonials
  const getVisibleIndices = () => {
    const prevIndex = activeIndex === 0 ? displayTestimonials.length - 1 : activeIndex - 1;
    const nextIndex = (activeIndex + 1) % displayTestimonials.length;
    return [prevIndex, activeIndex, nextIndex];
  };

  const [prevIndex, currentIndex, nextIndex] = getVisibleIndices();

  // Animation variants for cards
  const leftVariants = {
    enter: (dir: string) => ({
      x: dir === "right" ? "-100%" : "100%",
      opacity: 0,
      scale: 0.8,
      rotateY: dir === "right" ? 30 : -30,
      zIndex: 10
    }),
    center: {
      x: "-30%",
      opacity: 0.8,
      scale: 0.9,
      rotateY: 15,
      zIndex: 20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (dir: string) => ({
      x: dir === "right" ? "-100%" : "100%",
      opacity: 0,
      scale: 0.8,
      rotateY: dir === "right" ? 30 : -30,
      zIndex: 10,
      transition: { duration: 0.3 }
    })
  };

  const centerVariants = {
    enter: (dir: string) => ({
      x: dir === "right" ? "100%" : "-100%",
      opacity: 0.8,
      scale: 0.9,
      rotateY: dir === "right" ? -15 : 15,
      zIndex: 20
    }),
    center: {
      x: "0%",
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 30,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (dir: string) => ({
      x: dir === "right" ? "-100%" : "100%",
      opacity: 0.8,
      scale: 0.9,
      rotateY: dir === "right" ? 15 : -15,
      zIndex: 20,
      transition: { duration: 0.3 }
    })
  };

  const rightVariants = {
    enter: (dir: string) => ({
      x: dir === "right" ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
      rotateY: dir === "right" ? -30 : 30,
      zIndex: 10
    }),
    center: {
      x: "30%",
      opacity: 0.8,
      scale: 0.9,
      rotateY: -15,
      zIndex: 20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: (dir: string) => ({
      x: dir === "right" ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
      rotateY: dir === "right" ? -30 : 30,
      zIndex: 10,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div className="py-12">
      <h3 className="text-2xl font-bold mb-10 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Client Testimonials
      </h3>
      
      <div 
        className="relative w-full max-w-5xl mx-auto h-[400px] perspective-[1200px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Testimonial Carousel */}
        <div className="relative h-full overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {/* Left testimonial (previous) */}
            <motion.div 
              key={`left-${displayTestimonials[prevIndex].id}`}
              custom={direction}
              variants={leftVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-[30%]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <TestimonialCard 
                testimonial={displayTestimonials[prevIndex]}
                index={prevIndex}
                getRandomPastelColor={getRandomPastelColor}
                truncateText={truncateText}
                onReadMore={() => setSelectedTestimonial(displayTestimonials[prevIndex])}
                isActive={false}
              />
            </motion.div>

            {/* Center testimonial (current) */}
            <motion.div 
              key={`center-${displayTestimonials[currentIndex].id}`}
              custom={direction}
              variants={centerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-[40%]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <TestimonialCard 
                testimonial={displayTestimonials[currentIndex]}
                index={currentIndex}
                getRandomPastelColor={getRandomPastelColor}
                truncateText={truncateText}
                onReadMore={() => setSelectedTestimonial(displayTestimonials[currentIndex])}
                isActive={true}
              />
            </motion.div>

            {/* Right testimonial (next) */}
            <motion.div 
              key={`right-${displayTestimonials[nextIndex].id}`}
              custom={direction}
              variants={rightVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-1/2 left-1/2 transform -translate-y-1/2 w-[30%]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <TestimonialCard 
                testimonial={displayTestimonials[nextIndex]}
                index={nextIndex}
                getRandomPastelColor={getRandomPastelColor}
                truncateText={truncateText}
                onReadMore={() => setSelectedTestimonial(displayTestimonials[nextIndex])}
                isActive={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4 mt-8">
          <button 
            onClick={handlePrevious}
            className="p-2 rounded-full bg-elvis-dark/60 hover:bg-elvis-dark border border-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Previous testimonial"
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
                aria-label={`Go to testimonial ${index + 1}`}
                disabled={isAnimating}
              />
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            className="p-2 rounded-full bg-elvis-dark/60 hover:bg-elvis-dark border border-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Next testimonial"
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
    </div>
  );
};

// Separate TestimonialCard component for better code organization
interface TestimonialCardProps {
  testimonial: any;
  index: number;
  getRandomPastelColor: (index: number) => string;
  truncateText: (text: string, limit: number) => string;
  onReadMore: () => void;
  isActive: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  index, 
  getRandomPastelColor, 
  truncateText, 
  onReadMore,
  isActive
}) => {
  const textLimit = isActive ? 200 : 120;
  
  return (
    <div 
      className={cn(
        "p-6 rounded-xl border border-white/5 h-full shadow-lg transition-all duration-300",
        getRandomPastelColor(index),
        isActive ? "opacity-100 shadow-xl" : "opacity-80"
      )}
      style={{
        minHeight: isActive ? '300px' : '280px',
        transform: `scale(${isActive ? 1 : 0.95})`,
      }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 flex justify-between items-start">
          <Quote className="text-elvis-pink h-5 w-5 opacity-80" />
          <div className="flex">
            {[...Array(testimonial?.rating || 5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 text-elvis-pink/70 fill-elvis-pink/70" />
            ))}
          </div>
        </div>
        
        <p className="text-white/90 text-sm italic mb-4 flex-grow leading-relaxed">
          "{truncateText(testimonial?.quote || '', textLimit)}"
          {testimonial?.quote && testimonial?.quote.length > textLimit && (
            <Button
              variant="link"
              onClick={onReadMore}
              className="text-elvis-pink pl-1 h-auto p-0 text-xs font-normal"
            >
              Read More <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          )}
        </p>
        
        <div className="flex items-center mt-auto pt-3 border-t border-white/10">
          <div className="w-8 h-8 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold text-xs">
            {testimonial?.name 
              ? testimonial.name.charAt(0).toUpperCase() 
              : "C"}
          </div>
          <div className="ml-2">
            <h4 className="text-white font-medium text-xs">{testimonial?.name}</h4>
            <p className="text-white/60 text-[10px]">
              {testimonial?.position}
              {testimonial?.company 
                ? `, ${testimonial.company}` 
                : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
