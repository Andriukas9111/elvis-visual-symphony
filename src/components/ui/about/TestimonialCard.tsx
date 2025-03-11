
import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  onClick?: () => void;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial, 
  index,
  onClick
}) => {
  const initials = testimonial.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  
  return (
    <motion.div
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-6 rounded-xl border border-elvis-medium/20 shadow-md h-full flex flex-col"
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
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <Avatar className="h-12 w-12 border-2 border-elvis-medium/30">
            {testimonial.avatar_url ? (
              <AvatarImage src={testimonial.avatar_url} alt={testimonial.name} />
            ) : (
              <AvatarFallback className="bg-elvis-pink/20 text-elvis-pink">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div>
          <h3 className="text-base font-medium text-white">{testimonial.name}</h3>
          <p className="text-sm text-white/70">
            {testimonial.position}, {testimonial.company}
          </p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
            }`}
          />
        ))}
      </div>
      
      <p className="text-white/80 text-sm flex-grow">
        {testimonial.quote.length > 150
          ? `${testimonial.quote.substring(0, 150)}...`
          : testimonial.quote}
      </p>
      
      {testimonial.quote.length > 150 && onClick && (
        <div className="mt-4">
          <span className="text-elvis-pink text-sm cursor-pointer">
            Read more
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialCard;
