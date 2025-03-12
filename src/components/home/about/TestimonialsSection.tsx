
import React from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote } from 'lucide-react';
import { fallbackTestimonials } from './fallbackTestimonials';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const { data: testimonials, isLoading, error } = useTestimonials();
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<any>(null);
  
  // Make sure we always have a valid array to work with
  const displayTestimonials = testimonials && testimonials.length > 0
    ? testimonials
    : fallbackTestimonials.map(item => ({
        id: item.id,
        name: item.author,
        position: item.role.split(',')[0].trim(),
        company: item.role.split(',')[1]?.trim() || '',
        quote: item.content,
        avatar: '',
        is_featured: item.featured || false
      }));

  const truncateText = (text: string, limit: number) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-elvis-dark/40 rounded-xl p-6 animate-pulse h-64" />
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
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Client Testimonials
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {displayTestimonials.slice(0, 5).map((testimonial, index) => (
          <motion.div
            key={testimonial.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-elvis-dark/40 rounded-xl p-6 hover:bg-elvis-dark/60 transition-all"
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <Quote className="text-elvis-pink h-6 w-6" />
              </div>
              
              <p className="text-white/80 italic mb-4 flex-grow">
                {truncateText(testimonial.quote, 120)}
                {testimonial.quote && testimonial.quote.length > 120 && (
                  <Button
                    variant="link"
                    onClick={() => setSelectedTestimonial(testimonial)}
                    className="text-elvis-pink pl-2 h-auto p-0"
                  >
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </p>
              
              <div className="flex items-center mt-auto pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold">
                  {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">{testimonial.position}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="bg-elvis-darker border-elvis-dark">
          <DialogHeader>
            <DialogTitle>Testimonial</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedTestimonial && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold text-lg">
                    {selectedTestimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">{selectedTestimonial.name}</h4>
                    <p className="text-white/60">
                      {selectedTestimonial.position}, {selectedTestimonial.company}
                    </p>
                  </div>
                </div>
                <Quote className="text-elvis-pink h-8 w-8 mb-4" />
                <p className="text-white/80 italic text-lg leading-relaxed">
                  {selectedTestimonial.quote}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsSection;
