
import React from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import TestimonialCard from './TestimonialCard';
import TestimonialPagination from './TestimonialPagination';
import TestimonialLoadingState from './TestimonialLoadingState';
import { fallbackTestimonials } from './fallbackTestimonials';

interface TestimonialsSectionProps {
  isInView: boolean;
  characterLimit?: number;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  isInView,
  characterLimit = 150
}) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const testimonialsPerPage = 4;

  const { data: testimonials, isLoading, error } = useTestimonials();
  
  // Add detailed logging to help diagnose any issues
  React.useEffect(() => {
    if (isLoading) {
      console.log('Loading testimonials...');
    } else if (error) {
      console.error('Failed to load testimonials:', error);
    } else if (testimonials) {
      console.log(`Successfully loaded ${testimonials.length} testimonials from database`);
    } else {
      console.log('No testimonials received from database, using fallbacks');
    }
  }, [testimonials, isLoading, error]);

  if (error) {
    console.error('Error loading testimonials:', error);
  }

  const totalPages = testimonials ? Math.ceil(testimonials.length / testimonialsPerPage) : 0;
  
  const currentTestimonials = React.useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    
    const start = currentPage * testimonialsPerPage;
    return testimonials.slice(start, start + testimonialsPerPage);
  }, [testimonials, currentPage]);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Display loading state
  if (isLoading) {
    return <TestimonialLoadingState isInView={isInView} />;
  }
  
  const displayTestimonials = (testimonials && testimonials.length > 0) 
    ? currentTestimonials 
    : fallbackTestimonials;
  
  const displayTotalPages = (testimonials && testimonials.length > 0)
    ? totalPages
    : Math.ceil(fallbackTestimonials.length / testimonialsPerPage);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
          <h3 className="text-3xl font-bold">What Clients Say</h3>
        </div>
        
        {displayTotalPages > 1 && (
          <TestimonialPagination 
            currentPage={currentPage}
            totalPages={displayTotalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onPageSelect={(page) => setCurrentPage(page)}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayTestimonials.length > 0 ? (
          displayTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
              isInView={isInView}
              characterLimit={characterLimit}
            />
          ))
        ) : (
          <div className="col-span-4 text-center py-10">
            <p className="text-white/60">No testimonials found. Add some in the admin panel.</p>
          </div>
        )}
      </div>
      
      {displayTotalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <TestimonialPagination 
            currentPage={currentPage}
            totalPages={displayTotalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            onPageSelect={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialsSection;
