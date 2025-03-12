import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

interface TestimonialCarouselProps {
  testimonials: any[];
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push(testimonials[index]);
    }
    return result;
  };

  const truncateText = (text: string, limit: number) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  const variants = {
    enter: (index: number) => ({
      x: index === 1 ? 0 : index === 0 ? -100 : 100,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (index: number) => ({
      x: index === 1 ? 0 : index === 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <>
      <div className="flex justify-center items-center gap-6 py-12 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {getVisibleTestimonials().map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${index}`}
              custom={index}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 100,
              }}
              className={cn(
                "rounded-xl p-6 hover:shadow-md transition-all border border-white/5 bg-gradient-to-br from-[#D3E4FD]/10 to-[#E5DEFF]/5",
                index === 1 ? "w-[400px]" : "w-[300px] -mt-8"
              )}
            >
              <div className="flex flex-col h-full min-h-[240px]">
                <div className="mb-3 flex justify-between items-start">
                  <Quote className="text-elvis-pink h-5 w-5 opacity-80" />
                  <div className="flex">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-elvis-pink/70 fill-elvis-pink/70" />
                    ))}
                  </div>
                </div>
                
                <p className="text-white/80 text-sm italic mb-4 flex-grow leading-relaxed">
                  "{truncateText(testimonial.quote, 140)}"
                  {testimonial.quote && testimonial.quote.length > 140 && (
                    <Button
                      variant="link"
                      onClick={() => setSelectedTestimonial(testimonial)}
                      className="text-elvis-pink pl-1 h-auto p-0 text-xs font-normal"
                    >
                      Read More
                    </Button>
                  )}
                </p>
                
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
            </motion.div>
          ))}
        </AnimatePresence>
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
    </>
  );
};

export default TestimonialCarousel;
