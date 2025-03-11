
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  avatar_url?: string;
  rating: number;
  is_featured: boolean;
  order_index: number;
  client_name?: string; // For backward compatibility
  client_title?: string; // For backward compatibility
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
      console.log('Testimonials fetched:', data);
      return data as Testimonial[];
    }
  });

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-400"}>★</span>
    ));
  };

  return (
    <section className="py-16 bg-elvis-dark">
      <div className="container mx-auto px-4">
        <SectionHeading title="What Clients Say" />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="h-80 bg-elvis-medium rounded-lg animate-pulse" />
            ))}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial) => {
              // Use name field if available, fallback to client_name for backward compatibility
              const displayName = testimonial.name || testimonial.client_name || 'Client';
              // Use role field if available, fallback to client_title for backward compatibility
              const displayRole = testimonial.role || testimonial.client_title;
              // Use company if available
              const displayCompany = testimonial.company;
              
              return (
                <motion.div
                  key={testimonial.id}
                  className="bg-elvis-medium rounded-lg p-6 flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-3 text-xl">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  
                  <div className="text-elvis-pink text-4xl mb-2">"</div>
                  
                  <p className="text-white/80 mb-4 flex-grow line-clamp-4">
                    {testimonial.content}
                  </p>
                  
                  <div className="mt-auto">
                    <button className="text-elvis-pink text-sm mb-4">Read More</button>
                    
                    <div className="flex items-center">
                      {testimonial.avatar_url ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={testimonial.avatar_url} 
                            alt={displayName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-elvis-pink flex items-center justify-center mr-3">
                          <span className="text-white font-medium">
                            {displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium text-white">{displayName}</h4>
                        <p className="text-xs text-white/70">
                          {displayRole}
                          {displayCompany && displayRole ? `, ${displayCompany}` : displayCompany}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/70">No testimonials to display.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
