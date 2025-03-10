
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Testimonial } from './types';
import TestimonialDialog from './TestimonialDialog';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  isInView: boolean;
  characterLimit?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  index, 
  isInView,
  characterLimit = 150 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isLongQuote = testimonial.quote.length > characterLimit;
  
  const truncatedQuote = isLongQuote 
    ? `${testimonial.quote.substring(0, characterLimit)}...`
    : testimonial.quote;
  
  return (
    <>
      <motion.div
        key={testimonial.id}
        className="glass-card p-5 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
      >
        <Quote className="h-8 w-8 text-elvis-pink opacity-60 mb-3" />
        <p className="text-white/80 text-sm mb-4">{truncatedQuote}</p>
        
        {isLongQuote && (
          <button 
            className="text-elvis-pink text-sm hover:underline mt-auto self-start"
            onClick={() => setIsDialogOpen(true)}
          >
            Read More
          </button>
        )}
        
        <div className={isLongQuote ? 'mt-2' : 'mt-auto'}>
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-white/60">{testimonial.position}, {testimonial.company}</p>
        </div>
      </motion.div>
      
      <TestimonialDialog 
        testimonial={testimonial}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default TestimonialCard;
