
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Testimonial } from './types';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection = ({ isInView }: TestimonialsSectionProps) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('is_featured', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    
    fetchTestimonials();
    
    // Auto rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % Math.max(testimonials.length, 1));
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="mt-16"
    >
      <motion.div className="flex items-center mb-8">
        <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-3xl font-bold">Client Testimonials</h3>
        <motion.div 
          className="ml-auto h-px bg-elvis-gradient flex-grow max-w-[100px] opacity-50"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>
      
      <div className="relative overflow-hidden rounded-xl bg-elvis-medium/20 border border-white/5 p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 opacity-10 text-9xl font-serif text-elvis-pink">"</div>
        <div className="absolute bottom-0 left-0 opacity-10 text-9xl font-serif rotate-180 text-elvis-pink">"</div>
        
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="flex flex-col md:flex-row gap-8 items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: index === currentTestimonial ? 1 : 0,
              x: index === currentTestimonial ? 0 : 50,
              display: index === currentTestimonial ? 'flex' : 'none'
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:w-1/4 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-elvis-pink/30">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://randomuser.me/api/portraits/lego/1.jpg';
                    }}
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-elvis-medium border border-elvis-pink/40 rounded-full px-3 py-1 text-xs font-medium">
                  {testimonial.company}
                </div>
                <motion.div 
                  className="absolute -z-10 w-32 h-32 rounded-full border border-elvis-pink/20"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </div>
            </div>
            
            <div className="md:w-3/4 space-y-4">
              <p className="text-lg italic text-white/90 leading-relaxed">"{testimonial.quote}"</p>
              <div>
                <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-white/60">{testimonial.position}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Testimonial navigation */}
        <div className="mt-8 flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial ? 'bg-elvis-pink w-6' : 'bg-white/20'
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
