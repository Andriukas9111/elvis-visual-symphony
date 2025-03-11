
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import TestimonialCard from '@/components/ui/about/TestimonialCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer, fadeInUpVariant } from '@/types/about.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestimonialsSection: React.FC = () => {
  const { data: testimonials = [], isLoading } = useTestimonials();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-elvis-medium/20 h-10 w-48 rounded"></div>
        <div className="bg-elvis-medium/20 h-6 w-full rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-64"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // If no testimonials, show placeholder message
  if (testimonials.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeading 
          title="Client Testimonials" 
          subtitle="What clients say about working with me"
          accent="yellow"
        />
        <div className="text-center py-10">
          <p className="text-white/60">Testimonials coming soon...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <SectionHeading 
        title="Client Testimonials" 
        subtitle="What clients say about working with me"
        accent="yellow"
      />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {visibleTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </motion.div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="border-elvis-medium/30 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-white/70">
            Page {currentPage + 1} of {totalPages}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="border-elvis-medium/30 text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
