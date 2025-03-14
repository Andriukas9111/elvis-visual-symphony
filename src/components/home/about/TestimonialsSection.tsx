
import React from 'react';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import { fallbackTestimonials } from './fallbackTestimonials';
import TestimonialCarousel from './TestimonialCarousel';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const { data: testimonials, isLoading, error } = useTestimonials();
  
  // Make sure we always have testimonials to display
  const displayTestimonials = React.useMemo(() => {
    // Use database testimonials if available, otherwise use fallbacks
    const baseTestimonials = testimonials && testimonials.length > 0
      ? testimonials
      : fallbackTestimonials;

    // Map to a consistent format
    return baseTestimonials.map(item => ({
      id: item.id,
      name: item.client_name || item.author || '',
      position: item.role?.split(',')[0]?.trim() || '',
      company: item.role?.split(',')[1]?.trim() || item.client_company || '',
      quote: item.content || '',
      avatar: item.avatar_url || item.client_image || '',
      is_featured: item.is_featured || false,
      rating: item.rating || 5
    }));
  }, [testimonials]);

  if (isLoading) {
    return (
      <div className="flex justify-center gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-elvis-dark/40 rounded-xl p-6 animate-pulse h-64 w-[300px]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-white/80">Unable to load testimonials.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold mb-12 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Client Testimonials
      </h3>
      
      <TestimonialCarousel testimonials={displayTestimonials} />
    </div>
  );
};

export default TestimonialsSection;
