
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Testimonial } from './types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isInView: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index, isInView }) => {
  return (
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
  );
};

export default TestimonialCard;
