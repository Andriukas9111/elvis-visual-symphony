
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AboutHeader from './AboutHeader';
import AboutStory from './AboutStory';
import SocialStatistics from './SocialStatistics';
import KeyAccomplishments from './KeyAccomplishments';
import ExpertiseTabs from './ExpertiseTabs';
import ConnectWithMe from './ConnectWithMe';
import TestimonialsSection from './TestimonialsSection';
import ProjectsSlider from './ProjectsSlider';

const AboutSection: React.FC = () => {
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: storyRef, inView: storyInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: accomplishmentsRef, inView: accomplishmentsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: expertiseRef, inView: expertiseInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: connectRef, inView: connectInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  const { ref: projectsRef, inView: projectsInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  return (
    <div className="bg-elvis-dark text-white py-16 md:py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-40 left-10 w-3 h-3 rounded-full bg-elvis-pink/30"></div>
      <div className="absolute top-80 right-20 w-5 h-5 rounded-full bg-elvis-purple/20"></div>
      <div className="absolute bottom-40 left-1/4 w-4 h-4 rounded-full bg-elvis-pink/20"></div>
      <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-elvis-purple/10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <AboutHeader />
        </motion.div>
        
        {/* Social Statistics */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <SocialStatistics />
        </motion.div>
        
        {/* My Story */}
        <motion.div
          ref={storyRef}
          initial={{ opacity: 0, y: 20 }}
          animate={storyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <AboutStory />
        </motion.div>
        
        {/* Key Accomplishments */}
        <motion.div
          ref={accomplishmentsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={accomplishmentsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <KeyAccomplishments />
        </motion.div>
        
        {/* Expertise Tabs */}
        <motion.div
          ref={expertiseRef}
          initial={{ opacity: 0, y: 20 }}
          animate={expertiseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <ExpertiseTabs />
        </motion.div>
        
        {/* Connect With Me */}
        <motion.div
          ref={connectRef}
          initial={{ opacity: 0, y: 20 }}
          animate={connectInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <ConnectWithMe />
        </motion.div>
        
        {/* Featured Projects */}
        <motion.div
          ref={projectsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <ProjectsSlider />
        </motion.div>
        
        {/* Testimonials */}
        <motion.div
          ref={testimonialsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <TestimonialsSection />
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
