
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AboutStory from './AboutStory';
import SocialStatistics from './SocialStatistics';
import KeyAccomplishments from './KeyAccomplishments';
import ExpertiseTab from './ExpertiseTab';
import TechnicalSkillsTab from './TechnicalSkillsTab';
import TestimonialsSection from './TestimonialsSection';
import ConnectWithMe from './ConnectWithMe';
import { useContent } from '@/hooks/api/useContent';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  const { data: contentData } = useContent('about');
  
  // Extract title and subtitle from content data
  const aboutTitleData = contentData?.find(item => item.title)
  const defaultTitle = 'About Elvis Creative';
  const defaultSubtitle = 'Professional videographer with over 8 years of experience';
  
  // Use database values or fallback to defaults
  const title = aboutTitleData?.title || defaultTitle;
  const subtitle = aboutTitleData?.subtitle || defaultSubtitle;
  
  return (
    <div ref={ref} className="container mx-auto px-4 py-16 space-y-16">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-xl text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      </div>
      
      <AboutStory isInView={isInView} />
      
      <div className="space-y-16">
        <SocialStatistics isInView={isInView} />
        
        <KeyAccomplishments isInView={isInView} />
        
        <ExpertiseTab isInView={isInView} />
        
        <TechnicalSkillsTab isInView={isInView} />
        
        <TestimonialsSection isInView={isInView} />
        
        <ConnectWithMe isInView={isInView} />
      </div>
    </div>
  );
};

export default AboutSection;
