
import React from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import { Star, Quote } from 'lucide-react';
import { fallbackTestimonials } from './fallbackTestimonials';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const { data: testimonials, isLoading } = useTestimonials();
  
  // Use testimonials from database or fallback to default
  const displayTestimonials = testimonials && testimonials.length > 0 ? 
    testimonials.slice(0, 4) : fallbackTestimonials.slice(0, 4);
  
  // Generate a random star rating between 4 and 5
  const getRandomRating = () => Math.floor(Math.random() * 2) + 4;
  
  const TestimonialCard = ({ testimonial, index }: any) => {
    const starCount = getRandomRating();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-elvis-dark/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 h-full flex flex-col"
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' }}
      >
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-500"} 
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
          {testimonial.avatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-white/10">
              <img 
                src={testimonial.avatar} 
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
  
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        What Clients Say
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayTestimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
