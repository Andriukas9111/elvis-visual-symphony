
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TestimonialCarouselProps {
  testimonials: any[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  
  // Character limit for testimonial preview
  const CHARACTER_LIMIT = 120;
  
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);
  
  // Get visible testimonials (3 at a time)
  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (current + i) % testimonials.length;
      result.push(testimonials[index]);
    }
    return result;
  };
  
  const handlePrev = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    // Resume autoplay after user interaction
    setTimeout(() => setAutoplay(true), 20000);
  };
  
  const handleNext = () => {
    setAutoplay(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    // Resume autoplay after user interaction
    setTimeout(() => setAutoplay(true), 20000);
  };
  
  const openTestimonialDetail = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setOpenDialog(true);
  };
  
  // Check if text needs to be truncated
  const needsTruncation = (text: string) => {
    return text && text.length > CHARACTER_LIMIT;
  };
  
  // Truncate text and add ellipsis
  const truncateText = (text: string) => {
    if (!text) return '';
    if (text.length <= CHARACTER_LIMIT) return text;
    return text.substring(0, CHARACTER_LIMIT) + '...';
  };
  
  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrev}
          className="text-white/60 hover:text-white hover:bg-elvis-pink/20"
        >
          <ChevronLeft />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNext}
          className="text-white/60 hover:text-white hover:bg-elvis-pink/20"
        >
          <ChevronRight />
        </Button>
      </div>
      
      {/* Testimonial cards */}
      <div className="flex justify-center items-center gap-6 py-12">
        <AnimatePresence mode="wait">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`
                ${index === 1 ? 'z-10 scale-110' : 'scale-95 opacity-80'} 
                w-full max-w-sm bg-elvis-dark/80 border border-white/5 
                rounded-xl p-6 shadow-lg transform transition-all duration-300
                bg-gradient-to-br from-[#D3E4FD]/10 to-[#E5DEFF]/5
              `}
            >
              <div className="mb-3 flex justify-between items-start">
                <Quote className="text-elvis-pink h-5 w-5 opacity-80" />
                <div className="flex">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-elvis-pink/70 fill-elvis-pink/70" />
                  ))}
                </div>
              </div>
              
              <div className="text-white/80 text-sm italic mb-4 min-h-[80px]">
                <p>"{truncateText(testimonial.quote || testimonial.content)}"</p>
                {needsTruncation(testimonial.quote || testimonial.content) && (
                  <Button
                    variant="link"
                    onClick={() => openTestimonialDetail(testimonial)}
                    className="text-elvis-pink pl-1 h-auto p-0 text-xs font-normal"
                  >
                    Read More
                  </Button>
                )}
              </div>
              
              <div className="flex items-center mt-4 pt-2 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold text-xs">
                  {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : 
                   testimonial.author ? testimonial.author.charAt(0).toUpperCase() : "C"}
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium text-sm">{testimonial.name || testimonial.author}</h4>
                  <p className="text-white/60 text-xs">
                    {testimonial.position || testimonial.role?.split(',')[0]?.trim()}
                    {testimonial.company || testimonial.role?.split(',')[1]?.trim() 
                      ? `, ${testimonial.company || testimonial.role?.split(',')[1]?.trim()}` 
                      : ''}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Full testimonial dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-elvis-darker border-elvis-dark max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Client Testimonial</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedTestimonial && (
              <>
                <div className="flex justify-center mb-6">
                  <Quote className="text-elvis-pink h-10 w-10 opacity-70" />
                </div>
                
                <p className="text-white/90 italic text-base leading-relaxed text-center mb-6">
                  "{selectedTestimonial.quote || selectedTestimonial.content}"
                </p>
                
                <div className="flex items-center justify-center pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold">
                    {(selectedTestimonial.name || selectedTestimonial.author)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white font-medium">{selectedTestimonial.name || selectedTestimonial.author}</h4>
                    <p className="text-white/60 text-sm">
                      {selectedTestimonial.position || selectedTestimonial.role?.split(',')[0]?.trim()}
                      {selectedTestimonial.company || selectedTestimonial.role?.split(',')[1]?.trim() 
                        ? `, ${selectedTestimonial.company || selectedTestimonial.role?.split(',')[1]?.trim()}` 
                        : ''}
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

export default TestimonialCarousel;
