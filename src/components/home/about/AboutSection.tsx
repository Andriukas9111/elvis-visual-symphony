
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import AboutHeader from './AboutHeader';
import AboutProfile from './AboutProfile';
import AboutStory from './AboutStory';
import StatsGrid from './StatsGrid';
import UnifiedExpertiseContainer from './UnifiedExpertiseContainer';
import TestimonialsSection from './TestimonialsSection';

const AboutSection: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <section 
      id="about" 
      className="py-24 relative overflow-hidden bg-elvis-dark z-10"
      ref={ref}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-elvis-pink/5 filter blur-[100px]"></div>
        <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-elvis-purple/5 filter blur-[120px]"></div>
        <div className="absolute bottom-[5%] left-[20%] w-80 h-80 rounded-full bg-elvis-pink/5 filter blur-[90px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* About Header */}
        <AboutHeader isInView={inView} />
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left column - Profile */}
          <div className="lg:col-span-5">
            {/* Profile */}
            <AboutProfile isInView={inView} />
          </div>
          
          {/* Right column - Skills and Stats */}
          <div className="lg:col-span-7 space-y-10">
            {/* Statistics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StatsGrid isInView={inView} />
            </motion.div>
            
            {/* Skills and Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <UnifiedExpertiseContainer isInView={inView} />
            </motion.div>
          </div>
        </div>
        
        {/* My Story - Full width section */}
        <div className="mt-16">
          <AboutStory isInView={inView} />
        </div>
        
        {/* Testimonials section */}
        <div className="mt-16">
          <TestimonialsSection isInView={inView} />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
