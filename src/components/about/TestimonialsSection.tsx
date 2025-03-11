
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  content: string;
  client_name: string;
  client_title: string;
  client_company?: string;
  client_image?: string;
  rating: number;
  is_featured: boolean;
  order_index: number;
}

const TestimonialsSection: React.FC = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('order_index');
        
      if (error) throw error;
      return data as Testimonial[];
    }
  });
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <section className="py-16">
      <SectionHeading title="What Clients Say" />
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {isLoading ? (
          // Skeleton placeholders
          Array(4).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="h-80 rounded-lg bg-elvis-medium animate-pulse"
            />
          ))
        ) : (
          testimonials?.map(testimonial => (
            <motion.div
              key={testimonial.id}
              variants={item}
              className="rounded-lg bg-elvis-medium p-6 flex flex-col h-full"
            >
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <div className="flex-grow mb-6">
                <p className="text-white/80 italic">"{testimonial.content}"</p>
              </div>
              
              <div className="flex items-center">
                {testimonial.client_image ? (
                  <img 
                    src={testimonial.client_image} 
                    alt={testimonial.client_name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-elvis-pink flex items-center justify-center text-white font-medium mr-4">
                    {getInitials(testimonial.client_name)}
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium">{testimonial.client_name}</h4>
                  <p className="text-sm text-white/70">
                    {testimonial.client_title}
                    {testimonial.client_company && `, ${testimonial.client_company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
