
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
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
  
  // Generate random stars between 4 and 5
  const starCount = React.useMemo(() => Math.floor(Math.random() * 2) + 4, []);
  
  return (
    <>
      <motion.div
        key={testimonial.id}
        className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Star rating */}
        <div className="flex space-x-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} 
            />
          ))}
        </div>
        
        <Quote className="h-8 w-8 text-elvis-pink opacity-60 mb-3" />
        <p className="text-white/80 text-sm mb-4 leading-relaxed">{truncatedQuote}</p>
        
        {isLongQuote && (
          <button 
            className="text-elvis-pink text-sm hover:underline mt-auto self-start"
            onClick={() => setIsDialogOpen(true)}
          >
            Read More
          </button>
        )}
        
        <div className={`${isLongQuote ? 'mt-2' : 'mt-auto'} flex items-center`}>
          {testimonial.avatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-white/20">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-elvis-pink to-elvis-purple mr-3 flex items-center justify-center text-white font-bold">
              {testimonial.name.charAt(0)}
            </div>
          )}
          
          <div>
            <p className="font-semibold text-white">{testimonial.name}</p>
            <p className="text-xs text-white/60">{testimonial.position}, {testimonial.company}</p>
          </div>
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
