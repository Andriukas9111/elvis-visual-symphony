
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
    if (!isPaused && isInView) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % displayTestimonials.length);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [displayTestimonials.length, isPaused, isInView]);

  const truncateText = (text: string, limit: number) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  const handlePrevious = () => {
    setActiveIndex((current) => 
      current === 0 ? displayTestimonials.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((current) => 
      (current + 1) % displayTestimonials.length
    );
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

  return (
    <div className="py-12">
      <h3 className="text-2xl font-bold mb-10 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Client Testimonials
      </h3>
      
      <div className="relative w-full max-w-4xl mx-auto"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Testimonial Slider */}
        <div className="overflow-hidden rounded-xl">
          <div className="relative h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={cn(
                  "absolute inset-0 p-8 rounded-xl border border-white/5",
                  getRandomPastelColor(activeIndex)
                )}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 flex justify-between items-start">
                    <Quote className="text-elvis-pink h-6 w-6 opacity-80" />
                    <div className="flex">
                      {[...Array(displayTestimonials[activeIndex]?.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-elvis-pink/70 fill-elvis-pink/70" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-white/90 text-base italic mb-6 flex-grow leading-relaxed">
                    "{truncateText(displayTestimonials[activeIndex]?.quote || '', 180)}"
                    {displayTestimonials[activeIndex]?.quote && 
                     displayTestimonials[activeIndex]?.quote.length > 180 && (
                      <Button
                        variant="link"
                        onClick={() => setSelectedTestimonial(displayTestimonials[activeIndex])}
                        className="text-elvis-pink pl-1 h-auto p-0 text-sm font-normal"
                      >
                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </p>
                  
                  <div className="flex items-center mt-auto pt-4 border-t border-white/10">
                    <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold text-sm">
                      {displayTestimonials[activeIndex]?.name 
                        ? displayTestimonials[activeIndex].name.charAt(0).toUpperCase() 
                        : "C"}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-medium text-sm">{displayTestimonials[activeIndex]?.name}</h4>
                      <p className="text-white/60 text-xs">
                        {displayTestimonials[activeIndex]?.position}
                        {displayTestimonials[activeIndex]?.company 
                          ? `, ${displayTestimonials[activeIndex].company}` 
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevious}
              className="p-2 rounded-full bg-elvis-dark/60 hover:bg-elvis-dark border border-white/10 text-white/80 hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={handleNext}
              className="p-2 rounded-full bg-elvis-dark/60 hover:bg-elvis-dark border border-white/10 text-white/80 hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-1.5">
            {displayTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-elvis-pink/90 w-4' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
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

export default TestimonialsSection;
