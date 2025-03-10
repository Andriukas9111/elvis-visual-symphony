
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Testimonial } from './types';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const testimonialsPerPage = 4;
  const pageCount = Math.ceil(testimonials.length / testimonialsPerPage);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('is_featured', { ascending: false });
          
        if (error) throw error;
        
        setTestimonials(data as Testimonial[]);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => (prev === pageCount - 1 ? 0 : prev + 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? pageCount - 1 : prev - 1));
  };

  const paginatedTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all mb-6">
        <h3 className="text-2xl font-bold mb-6">What Clients Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all mb-6">
        <h3 className="text-2xl font-bold mb-6">What Clients Say</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all mb-6" ref={ref}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">What Clients Say</h3>
        
        {pageCount > 1 && (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={prevPage}
              className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-elvis-pink/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextPage}
              className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-elvis-pink/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="rounded-xl p-4 border border-white/10 hover:border-elvis-pink/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex space-x-3 items-center mb-3">
              <Avatar className="h-10 w-10 border border-elvis-pink/20">
                {testimonial.avatar ? (
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                ) : (
                  <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium text-sm">{testimonial.name}</p>
                <p className="text-xs text-white/70">{testimonial.position}</p>
              </div>
            </div>
            <blockquote className="text-white/80 italic text-sm">"{testimonial.quote.length > 120 ? `${testimonial.quote.substring(0, 120)}...` : testimonial.quote}"</blockquote>
          </motion.div>
        ))}
      </div>
      
      {pageCount > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: pageCount }).map((_, i) => (
            <Button 
              key={i}
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(i)}
              className={`h-2 w-2 rounded-full mx-1 p-0 ${
                currentPage === i ? 'bg-elvis-pink' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
