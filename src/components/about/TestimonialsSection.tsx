
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  content: string;
  is_featured: boolean;
  order_index: number;
  avatar_url?: string;
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
  
  // Fallback testimonials
  const fallbackTestimonials = [
    {
      id: '1',
      client_name: 'John Smith',
      client_title: 'Marketing Director, Creative Agency',
      content: 'Elvis delivered exceptional video content that perfectly captured our brand identity. His creative vision and technical skills are outstanding!',
      is_featured: true,
      order_index: 1
    },
    {
      id: '2',
      client_name: 'Sarah Johnson',
      client_title: 'CEO, Tech Startup',
      content: 'Working with Elvis was a game-changer for our product launch videos. His attention to detail and storytelling ability helped us connect with our audience.',
      is_featured: true,
      order_index: 2
    },
    {
      id: '3',
      client_name: 'Michael Brown',
      client_title: 'Event Manager, Conference Group',
      content: 'Elvis captured our annual conference with style and professionalism. The highlight reel he created was exactly what we needed to promote next year\'s event.',
      is_featured: true,
      order_index: 3
    },
    {
      id: '4',
      client_name: 'Emma Wilson',
      client_title: 'Brand Manager, Fashion Label',
      content: 'The fashion videos Elvis created for our seasonal collection exceeded our expectations. His understanding of our aesthetic was spot-on!',
      is_featured: true,
      order_index: 4
    }
  ];
  
  const displayTestimonials = (testimonials && testimonials.length > 0) 
    ? testimonials 
    : fallbackTestimonials;

  const testimonialVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-8 bg-black">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold flex items-center">
            <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
            What Clients Say
          </h2>
          
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={testimonialVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card className="bg-[#121212] border-gray-800 h-full flex flex-col">
                  <CardContent className="pt-6 pb-4 flex flex-col flex-1">
                    <div className="flex items-start mb-2">
                      <div className="text-stars flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className="text-yellow-400">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-elvis-pink text-2xl font-serif mb-2">❝</div>
                    
                    <p className="text-white/80 mb-4 line-clamp-5 flex-1">
                      {testimonial.content}
                    </p>
                    
                    <button className="text-sm text-elvis-pink mb-4 self-start hover:underline">
                      Read More
                    </button>
                    
                    <div className="flex items-center mt-auto">
                      <div className="w-8 h-8 rounded-full bg-elvis-pink flex items-center justify-center mr-3 text-xs font-bold">
                        {testimonial.client_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{testimonial.client_name}</h4>
                        <p className="text-xs text-white/60">{testimonial.client_title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
