
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import AboutHeader from './AboutHeader';
import AboutStory from './AboutStory';
import SocialStatistics from './SocialStatistics';
import KeyAccomplishments from './KeyAccomplishments';
import TestimonialsSection from './TestimonialsSection';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <section ref={sectionRef} className="py-20 bg-elvis-dark relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-16"
        >
          <AboutHeader />
          
          <AboutStory />
          
          <SocialStatistics isInView={inView} />
          
          <KeyAccomplishments isInView={inView} />
          
          <TestimonialsSection isInView={inView} />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
