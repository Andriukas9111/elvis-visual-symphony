
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
        
        {/* Restructured content flow */}
        <div className="space-y-16">
          {/* 1. Statistics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            id="about-stats"
            className="mt-16"
          >
            <StatsGrid isInView={inView} />
          </motion.div>
          
          {/* 2. About Story & Profile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left column - Profile */}
            <div className="lg:col-span-5">
              <AboutProfile isInView={inView} />
            </div>
            
            {/* Right column - My Story */}
            <div className="lg:col-span-7">
              <AboutStory isInView={inView} />
            </div>
          </div>
          
          {/* 3. Expertise & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            id="about-expertise"
          >
            <UnifiedExpertiseContainer isInView={inView} />
          </motion.div>
          
          {/* 4. Testimonials section */}
          <div id="about-testimonials">
            <TestimonialsSection isInView={inView} characterLimit={150} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
