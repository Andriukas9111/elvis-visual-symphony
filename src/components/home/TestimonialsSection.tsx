
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTestimonials } from '@/hooks/api/useTestimonials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const { testimonials, isLoading } = useTestimonials();
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Function to render star ratings
  const renderRating = (rating: number = 5) => {
    return (
      <div className="flex space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-card/30 animate-pulse h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-elvis-dark" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          What Clients Say
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {testimonials?.map((testimonial, index) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="h-full bg-card/30 hover:bg-card/50 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Rating */}
                  {renderRating(testimonial.rating)}
                  
                  {/* Quote */}
                  <div className="relative mb-4 flex-grow">
                    <span className="absolute -top-4 -left-2 text-4xl text-primary opacity-30">❝</span>
                    <p className="text-sm text-muted-foreground relative z-10">
                      {testimonial.content}
                    </p>
                    <span className="absolute bottom-0 right-0 text-4xl text-primary opacity-30">❞</span>
                  </div>
                  
                  {/* Client Info */}
                  <div className="flex items-center mt-4">
                    <Avatar className="h-10 w-10 mr-3 border border-primary/20">
                      <AvatarImage src={testimonial.client_image || ''} alt={testimonial.client_name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(testimonial.client_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm">{testimonial.client_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.client_title}
                        {testimonial.client_company && `, ${testimonial.client_company}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
