
import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  return (
    <motion.div
      className="bg-elvis-dark/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 h-full flex flex-col"
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"} 
          />
        ))}
      </div>
      
      <Quote className="h-6 w-6 text-elvis-pink opacity-60 mb-3" />
      
      <p className="text-white/80 text-sm leading-relaxed mb-4">
        {testimonial.quote.length > 150 ? 
          `${testimonial.quote.substring(0, 150)}...` : 
          testimonial.quote
        }
      </p>
      
      <div className="mt-auto flex items-center">
        {testimonial.avatar_url ? (
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-white/10">
            <img 
              src={testimonial.avatar_url} 
              alt={testimonial.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-elvis-pink flex items-center justify-center text-white font-bold mr-3">
            {testimonial.name.charAt(0)}
          </div>
        )}
        
        <div>
          <p className="font-medium text-white">{testimonial.name}</p>
          <p className="text-xs text-white/60">{testimonial.position}, {testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
