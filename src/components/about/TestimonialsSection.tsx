
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  const [openTestimonial, setOpenTestimonial] = useState<Testimonial | null>(null);
  
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

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-400"}>★</span>
    ));
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Fallback testimonials if none are available from the database
  const fallbackTestimonials = [
    {
      id: '1',
      name: 'John Smith',
      role: 'Marketing Director',
      company: 'Creative Agency',
      content: 'Elvis delivered exceptional video content that perfectly captured our brand identity. His creative vision and technical skills are outstanding!',
      rating: 4,
      is_featured: true,
      order_index: 1
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'Tech Startup',
      content: 'Working with Elvis was a game-changer for our product launch videos. His attention to detail and storytelling ability helped us connect with our audience.',
      rating: 5,
      is_featured: true,
      order_index: 2
    },
    {
      id: '3',
      name: 'Michael Brown',
      role: 'Event Manager',
      company: 'Conference Group',
      content: 'Elvis captured our annual conference with style and professionalism. The highlight reel he created was exactly what we needed to promote next year\'s event.',
      rating: 4,
      is_featured: true,
      order_index: 3
    },
    {
      id: '4',
      name: 'Emma Wilson',
      role: 'Brand Manager',
      company: 'Fashion Label',
      content: 'The fashion videos Elvis created for our seasonal collection exceeded our expectations. His understanding of our aesthetic was spot-on!',
      rating: 5,
      is_featured: true,
      order_index: 4
    }
  ];

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {(testimonials?.length ? testimonials : fallbackTestimonials).map((testimonial) => {
              // Use name field if available, fallback to client_name for backward compatibility
              const displayName = testimonial.name || testimonial.client_name || 'Client';
              // Use role field if available, fallback to client_title for backward compatibility
              const displayRole = testimonial.role || testimonial.client_title;
              // Use company if available
              const displayCompany = testimonial.company;
              
              return (
                <motion.div
                  key={testimonial.id}
                  className="bg-[#151515] rounded-lg p-6 flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-3 text-xl">
                    {renderStars(testimonial.rating || 5)}
                  </div>
                  
                  <div className="text-elvis-pink text-4xl mb-2">"</div>
                  
                  <p className="text-white/80 mb-4 flex-grow">
                    {truncateText(testimonial.content)}
                  </p>
                  
                  <div className="mt-auto">
                    {testimonial.content.length > 150 && (
                      <button 
                        className="text-elvis-pink text-sm mb-4"
                        onClick={() => setOpenTestimonial(testimonial)}
                      >
                        Read More
                      </button>
                    )}
                    
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
        )}
      </div>

      {/* Testimonial Dialog */}
      <Dialog open={!!openTestimonial} onOpenChange={(open) => !open && setOpenTestimonial(null)}>
        <DialogContent className="bg-elvis-medium border-elvis-light text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {openTestimonial?.name || openTestimonial?.client_name}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {openTestimonial?.role || openTestimonial?.client_title}
              {openTestimonial?.company && (openTestimonial?.role || openTestimonial?.client_title) 
                ? `, ${openTestimonial.company}` 
                : openTestimonial?.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mb-3 text-xl">
            {openTestimonial && renderStars(openTestimonial.rating || 5)}
          </div>
          
          <div className="text-elvis-pink text-4xl mb-2">"</div>
          
          <p className="text-white/80 mb-4">
            {openTestimonial?.content}
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TestimonialsSection;
