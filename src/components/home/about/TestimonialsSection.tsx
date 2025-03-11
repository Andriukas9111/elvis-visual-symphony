
import React from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import TestimonialCard from '@/components/ui/about/TestimonialCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer } from '@/types/about.types';

const TestimonialsSection: React.FC = () => {
  const { data: testimonials = [], isLoading } = useTestimonials();
  
  // Default testimonials in case database is empty
  const defaultTestimonials = [
    {
      id: '1',
      name: "John Smith",
      position: "Marketing Director",
      company: "Creative Agency",
      quote: "Elvis delivered exceptional video content that perfectly captured our brand identity. His creative vision and technical skills are outstanding!",
      avatar_url: "", 
      is_featured: true,
      rating: 5,
      sort_order: 0,
      created_at: '',
      updated_at: ''
    },
    {
      id: '2',
      name: "Sarah Johnson",
      position: "CEO",
      company: "Tech Startup",
      quote: "Working with Elvis was a game-changer for our product launch videos. His attention to detail and storytelling ability helped us connect with our audience in a meaningful way.",
      avatar_url: "",
      is_featured: true,
      rating: 5,
      sort_order: 1,
      created_at: '',
      updated_at: ''
    },
    {
      id: '3',
      name: "Michael Brown",
      position: "Event Manager",
      company: "Conference Group",
      quote: "Elvis captured our annual conference with style and professionalism. The highlight reel he created was exactly what we needed to promote next year's event.",
      avatar_url: "",
      is_featured: false,
      rating: 4,
      sort_order: 2,
      created_at: '',
      updated_at: ''
    },
    {
      id: '4',
      name: "Emma Wilson",
      position: "Brand Manager",
      company: "Fashion Label",
      quote: "The fashion videos Elvis created for our seasonal collection exceeded our expectations. His understanding of our aesthetic was spot-on!",
      avatar_url: "",
      is_featured: false,
      rating: 5,
      sort_order: 3,
      created_at: '',
      updated_at: ''
    }
  ];
  
  // Use testimonials from database or fallback to default
  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  
  if (isLoading) {
    return (
      <div>
        <div className="bg-elvis-medium/20 h-10 w-48 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading 
        title="Client Testimonials" 
        subtitle="Hear what clients say about working with me"
        accent="blue"
      />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {displayTestimonials.slice(0, 4).map((testimonial, index) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial} 
            index={index} 
          />
        ))}
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;
