
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const { data: testimonials, isLoading } = useTestimonials();
  const displayTestimonials = testimonials?.filter(t => t.is_featured) || [];

  return (
    <div className="relative">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        What Clients Say
      </h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={isInView ? 'visible' : 'hidden'}
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-elvis-dark/40 rounded-xl p-6 shadow-md"
            >
              <p className="text-white/80 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || '/placeholder-avatar.webp'}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                  onError={(e: any) => {
                    e.target.src = '/placeholder-avatar.webp';
                  }}
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-elvis-pink">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsSection;
