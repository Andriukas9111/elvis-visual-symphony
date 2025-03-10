
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import AboutHeader from './AboutHeader';
import AboutProfile from './AboutProfile';
import AboutStory from './AboutStory';
import SocialStatisticsGrid from './SocialStatisticsGrid';
import AccomplishmentsDisplay from './AccomplishmentsDisplay';
import EnhancedExpertiseContainer from './EnhancedExpertiseContainer';
import ProjectsShowcase from './ProjectsShowcase';
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
      {/* Enhanced decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-elvis-pink/5 filter blur-[100px]"></div>
        <div className="absolute top-[40%] right-[10%] w-96 h-96 rounded-full bg-elvis-purple/5 filter blur-[120px]"></div>
        <div className="absolute bottom-[5%] left-[20%] w-80 h-80 rounded-full bg-elvis-pink/5 filter blur-[90px]"></div>
        <div className="absolute top-[15%] right-[30%] w-40 h-40 rounded-full bg-elvis-pink/3 filter blur-[80px]"></div>
        <div className="absolute bottom-[30%] right-[5%] w-48 h-48 rounded-full bg-elvis-purple/4 filter blur-[90px]"></div>
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 bg-neon-grid bg-grid-md opacity-5"></div>
        
        {/* Animated gradient lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-elvis-pink/20 to-transparent"></div>
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-elvis-purple/20 to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-elvis-pink/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* About Header */}
        <AboutHeader isInView={inView} />
        
        {/* Redesigned content flow */}
        <div className="space-y-20">
          {/* 1. Social Statistics Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            id="about-social-stats"
            className="mt-16"
          >
            <SocialStatisticsGrid isInView={inView} />
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
          
          {/* 3. Accomplishments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            id="about-accomplishments"
          >
            <AccomplishmentsDisplay isInView={inView} />
          </motion.div>
          
          {/* 4. Expertise & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            id="about-expertise"
          >
            <EnhancedExpertiseContainer isInView={inView} />
          </motion.div>
          
          {/* 5. Projects Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            id="about-projects"
          >
            <ProjectsShowcase isInView={inView} />
          </motion.div>
          
          {/* 6. Testimonials section */}
          <div id="about-testimonials">
            <TestimonialsSection isInView={inView} characterLimit={150} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
