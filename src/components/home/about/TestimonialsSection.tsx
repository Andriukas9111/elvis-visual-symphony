
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Testimonial } from './types';
import { supabase } from '@/lib/supabase';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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

  if (isLoading) {
    return (
      <div className="py-8">
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
      <div className="py-8">
        <h3 className="text-2xl font-bold mb-6">What Clients Say</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-8" ref={ref}>
      <h3 className="text-2xl font-bold mb-6">What Clients Say</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="glass-card rounded-xl p-6 border border-white/10 hover:border-elvis-pink/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex space-x-4 items-center mb-4">
              <Avatar className="h-12 w-12 border-2 border-elvis-pink/20">
                {testimonial.avatar ? (
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                ) : (
                  <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-white/70">{testimonial.position}, {testimonial.company}</p>
              </div>
            </div>
            <blockquote className="text-white/80 italic">"{testimonial.quote}"</blockquote>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
