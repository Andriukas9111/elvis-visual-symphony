
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AboutHeader from './AboutHeader';
import AboutProfile from './AboutProfile';
import AboutStory from './AboutStory';
import ExpertiseContainer from './ExpertiseContainer';
import { useContent } from '@/hooks/api/useContent';
import StatsGrid from './StatsGrid';
import TestimonialsSection from './TestimonialsSection';

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { data: aboutContent } = useContent('about');

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-24 bg-elvis-dark relative overflow-hidden"
    >
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-elvis-pink/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-elvis-purple/10 blur-[120px] rounded-full"></div>
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 bg-neon-grid bg-grid-lg opacity-20"></div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-20 left-1/4 w-32 h-32 border border-elvis-pink/20 rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-40 right-1/4 w-48 h-48 border border-elvis-purple/20 rounded-full"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 6,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      ></motion.div>
      
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AboutHeader isInView={isInView} title={aboutContent?.find(item => item.title)?.title || "About Elvis Creative"} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Profile */}
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <AboutProfile isInView={isInView} />
          </motion.div>
          
          {/* Right Column: Story & Expertise */}
          <motion.div 
            className="lg:col-span-7 space-y-10"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            {/* Stats Grid - Above the story */}
            <StatsGrid isInView={isInView} />
            
            <AboutStory 
              isInView={isInView} 
              content={aboutContent?.find(item => item.content)?.content || ""}
            />
            
            {/* Expertise Container */}
            <ExpertiseContainer isInView={isInView} />
            
            {/* Testimonials Section */}
            <TestimonialsSection />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
