
import React from 'react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Quote, Star } from 'lucide-react';
import { fallbackTestimonials } from './fallbackTestimonials';
import { cn } from '@/lib/utils';

interface TestimonialsSectionProps {
  isInView: boolean;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ isInView }) => {
  const { data: testimonials, isLoading, error } = useTestimonials();
  const [selectedTestimonial, setSelectedTestimonial] = React.useState<any>(null);
  
  // Make sure we always have exactly 6 testimonials to display
  const displayTestimonials = React.useMemo(() => {
    const baseTestimonials = testimonials && testimonials.length > 0
      ? testimonials
      : fallbackTestimonials;

    return baseTestimonials.slice(0, 6).map(item => ({
      id: item.id,
      name: item.author || '',
      position: item.role?.split(',')[0]?.trim() || '',
      company: item.role?.split(',')[1]?.trim() || '',
      quote: item.content || '',
      avatar: '',
      is_featured: item.featured || false,
      rating: item.rating || 5
    }));
  }, [testimonials]);

  const truncateText = (text: string, limit: number) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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

  // Generate random pastel colors for testimonial cards
  const getRandomPastelColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-[#FEC6A1]/10 to-[#FDE1D3]/5',
      'bg-gradient-to-br from-[#D3E4FD]/10 to-[#E5DEFF]/5',
      'bg-gradient-to-br from-[#FFDEE2]/10 to-[#F1F0FB]/5',
      'bg-gradient-to-br from-[#F2FCE2]/10 to-[#E5DEFF]/5',
      'bg-gradient-to-br from-[#FEF7CD]/10 to-[#FDE1D3]/5',
      'bg-gradient-to-br from-[#E5DEFF]/10 to-[#D3E4FD]/5',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="py-8">
      <h3 className="text-2xl font-bold mb-12 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Client Testimonials
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "rounded-xl p-6 hover:shadow-md transition-all border border-white/5",
              getRandomPastelColor(index)
            )}
          >
            <div className="flex flex-col h-full min-h-[240px]">
              <div className="mb-3 flex justify-between items-start">
                <Quote className="text-elvis-pink h-5 w-5 opacity-80" />
                <div className="flex">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-elvis-pink/70 fill-elvis-pink/70" />
                  ))}
                </div>
              </div>
              
              <p className="text-white/80 text-sm italic mb-4 flex-grow leading-relaxed">
                "{truncateText(testimonial.quote, 140)}"
                {testimonial.quote && testimonial.quote.length > 140 && (
                  <Button
                    variant="link"
                    onClick={() => setSelectedTestimonial(testimonial)}
                    className="text-elvis-pink pl-1 h-auto p-0 text-xs font-normal"
                  >
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </p>
              
              <div className="flex items-center mt-auto pt-3 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold text-xs">
                  {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
                  <p className="text-white/60 text-xs">{testimonial.position}{testimonial.company ? `, ${testimonial.company}` : ''}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="bg-elvis-darker border-elvis-dark max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center">Client Testimonial</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedTestimonial && (
              <>
                <div className="flex justify-center items-center mb-5">
                  <div className="flex">
                    {[...Array(selectedTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-elvis-pink/80 fill-elvis-pink/80" />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mb-6">
                  <Quote className="text-elvis-pink h-10 w-10 opacity-70" />
                </div>
                
                <p className="text-white/90 italic text-base leading-relaxed text-center mb-6">
                  "{selectedTestimonial.quote}"
                </p>
                
                <div className="flex items-center justify-center pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-elvis-pink/20 flex items-center justify-center text-white font-bold">
                    {selectedTestimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-white font-medium">{selectedTestimonial.name}</h4>
                    <p className="text-white/60 text-sm">
                      {selectedTestimonial.position}{selectedTestimonial.company ? `, ${selectedTestimonial.company}` : ''}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsSection;
