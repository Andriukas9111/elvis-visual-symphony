
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface TestimonialsSectionProps {
  isInView: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  quote: string;
  avatar?: string;
  is_featured?: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const testimonialsPerPage = 4;

  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      console.log('Fetching testimonials from Supabase');
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('is_featured', { ascending: false });
        
      if (error) {
        console.error('Error fetching testimonials:', error);
        throw error;
      }
      
      console.log('Testimonials fetched:', data);
      return data as Testimonial[];
    }
  });
  
  const totalPages = testimonials ? Math.ceil(testimonials.length / testimonialsPerPage) : 0;
  
  const currentTestimonials = React.useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    
    const start = currentPage * testimonialsPerPage;
    return testimonials.slice(start, start + testimonialsPerPage);
  }, [testimonials, currentPage]);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Fallback testimonials in case none are loaded from the database
  const fallbackTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'John Smith',
      position: 'Marketing Director',
      company: 'Creative Agency',
      quote: 'Elvis delivered exceptional video content that perfectly captured our brand identity. His creative vision and technical skills are outstanding!'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'CEO',
      company: 'Tech Startup',
      quote: 'Working with Elvis was a game-changer for our product launch videos. His attention to detail and storytelling ability helped us connect with our audience in a meaningful way.'
    },
    {
      id: '3',
      name: 'Michael Brown',
      position: 'Event Manager',
      company: 'Conference Group',
      quote: 'Elvis captured our annual conference with style and professionalism. The highlight reel he created was exactly what we needed to promote next year's event.'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      position: 'Brand Manager',
      company: 'Fashion Label',
      quote: 'The fashion videos Elvis created for our seasonal collection exceeded our expectations. His understanding of our aesthetic was spot-on!'
    }
  ];
  
  // Show error in console but don't return null so we still render the section
  if (error) {
    console.error('Error loading testimonials:', error);
  }
  
  // Use fallback testimonials if none are loaded from the database
  const displayTestimonials = (testimonials && testimonials.length > 0) 
    ? currentTestimonials 
    : fallbackTestimonials;
  
  // Calculate pages based on what we're displaying
  const displayTotalPages = (testimonials && testimonials.length > 0)
    ? totalPages
    : Math.ceil(fallbackTestimonials.length / testimonialsPerPage);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <span className="h-7 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
          <h3 className="text-3xl font-bold">What Clients Say</h3>
        </div>
        
        {displayTotalPages > 1 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextPage}
              disabled={currentPage === displayTotalPages - 1}
              className="border-white/10 hover:border-elvis-pink/60 hover:bg-elvis-pink/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayTestimonials.map((testimonial, index) => (
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
        ))}
      </div>
      
      {displayTotalPages > 1 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: displayTotalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === currentPage ? 'bg-elvis-pink' : 'bg-white/30'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TestimonialsSection;
