
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface TestimonialsSectionProps {
  isInView: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const testimonialsPerPage = 4;

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false });
        
      if (error) throw error;
      return data as Testimonial[];
    }
  });
  
  const totalPages = testimonials ? Math.ceil(testimonials.length / testimonialsPerPage) : 0;
  
  const currentTestimonials = React.useMemo(() => {
    if (!testimonials) return [];
    
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
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center mb-8">
          <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
          <div className="h-8 w-52 bg-white/10 rounded"></div>
          <div className="ml-auto h-px bg-elvis-gradient flex-grow max-w-[100px] opacity-50"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-5 rounded-xl border border-white/10 h-64">
              <div className="h-4 w-20 bg-white/10 rounded mb-3"></div>
              <div className="h-32 bg-white/10 rounded mb-3"></div>
              <div className="h-4 w-24 bg-white/10 rounded"></div>
              <div className="h-3 w-16 bg-white/10 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
          <h3 className="text-3xl font-bold">What Clients Say</h3>
        </div>
        
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="glass-card p-5 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Quote className="h-8 w-8 text-elvis-pink opacity-60 mb-3" />
            <p className="text-white/80 text-sm mb-4 line-clamp-5">{testimonial.quote}</p>
            <div className="mt-auto">
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-xs text-white/60">{testimonial.position}, {testimonial.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentPage ? 'bg-elvis-pink' : 'bg-white/30'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialsSection;
