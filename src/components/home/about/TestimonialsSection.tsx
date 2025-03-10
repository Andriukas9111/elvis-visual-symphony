
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from './types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  isInView: boolean;
}

const TestimonialsSection = ({ testimonials, isInView }: TestimonialsSectionProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Navigation functions for testimonials
  const goToPrevious = () => {
    setCurrentTestimonial((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentTestimonial((prev) => 
      (prev + 1) % testimonials.length
    );
  };

  return (
    <motion.div 
      className="mt-20"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold mb-2">Client Testimonials</h3>
        <div className="h-1 w-20 bg-elvis-gradient mx-auto mb-4"></div>
        <p className="text-white/60 max-w-lg mx-auto">What clients say about working with Elvis Creative</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Testimonial Cards */}
          <div className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`transition-opacity duration-500 ${index === currentTestimonial ? 'block' : 'hidden'}`}
              >
                <div className="grid md:grid-cols-12 items-center">
                  {/* Client image */}
                  <div className="md:col-span-4 bg-elvis-medium flex flex-col items-center justify-center py-8 px-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-elvis-pink/30 mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full border border-elvis-pink/20 animate-pulse-slow -m-1"></div>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{testimonial.name}</h4>
                    <p className="text-elvis-pink text-sm">{testimonial.company}</p>
                  </div>
                  
                  {/* Testimonial text */}
                  <div className="md:col-span-8 p-8 relative">
                    <svg className="absolute top-6 left-6 h-10 w-10 text-elvis-pink/20" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    
                    <blockquote className="relative z-10 text-lg italic text-white/90 ml-6">
                      {testimonial.quote}
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 px-4 z-10">
            <button 
              onClick={goToPrevious}
              className="h-10 w-10 rounded-full bg-elvis-medium/80 hover:bg-elvis-pink border border-elvis-pink/30 flex items-center justify-center backdrop-blur-sm transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={goToNext}
              className="h-10 w-10 rounded-full bg-elvis-medium/80 hover:bg-elvis-pink border border-elvis-pink/30 flex items-center justify-center backdrop-blur-sm transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Testimonial indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'w-6 bg-elvis-pink' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialsSection;
