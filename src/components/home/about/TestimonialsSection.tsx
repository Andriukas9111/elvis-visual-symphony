
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import { Loader2 } from 'lucide-react';
import { fallbackTestimonials } from './fallbackTestimonials';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const { data: testimonials, isLoading, error } = useTestimonials ? useTestimonials() : { data: null, isLoading: false, error: null };
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // If no useTestimonials hook exists or no data is loaded, use fallback data
  const displayTestimonials = testimonials && testimonials.length > 0
    ? testimonials
    : fallbackTestimonials;
  
  // Pagination setup
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(displayTestimonials.length / testimonialsPerPage);
  
  // Get current testimonials to display
  const currentTestimonials = displayTestimonials.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage
  );
  
  // Auto-advance pagination
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [isInView, totalPages]);
  
  // Component to display loading state
  const TestimonialLoadingState = () => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-elvis-dark/40 rounded-xl p-6 h-64" />
      ))}
    </div>
  );
  
  // Component to display testimonial card
  const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
    if (!testimonial) return null;
    
    return (
      <div className="bg-elvis-dark/40 rounded-xl p-6 h-full flex flex-col">
        <div className="mb-4">
          {/* Rating stars */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < (testimonial.rating || 5) ? "text-yellow-400" : "text-gray-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        
        {/* Testimonial content */}
        <p className="text-white/80 italic mb-6 flex-grow">
          "{testimonial.content || "This videographer is amazing! The quality of work is outstanding."}"
        </p>
        
        {/* Testimonial author */}
        <div className="flex items-center mt-auto">
          <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold">
            {testimonial.author ? testimonial.author.charAt(0).toUpperCase() : "C"}
          </div>
          <div className="ml-3">
            <h4 className="text-white font-bold">{testimonial.author || "Client Name"}</h4>
            <p className="text-white/60 text-sm">{testimonial.role || "Position, Company"}</p>
          </div>
        </div>
      </div>
    );
  };
  
  // Pagination indicator component
  const PaginationIndicator = () => (
    <div className="flex justify-center mt-8">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentIndex(i)}
          className={`mx-1 w-3 h-3 rounded-full ${
            i === currentIndex ? "bg-elvis-pink" : "bg-gray-600"
          }`}
          aria-label={`Go to page ${i + 1}`}
        />
      ))}
    </div>
  );
  
  // Main render
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Client Testimonials
      </h3>
      
      {isLoading ? (
        <TestimonialLoadingState />
      ) : error ? (
        <div className="bg-red-900/20 p-4 rounded-lg">
          <p className="text-white/80">Unable to load testimonials. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
          <PaginationIndicator />
        </>
      )}
    </div>
  );
};

export default TestimonialsSection;
