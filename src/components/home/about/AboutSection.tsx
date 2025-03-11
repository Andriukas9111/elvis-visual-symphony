
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import AboutProfile from './AboutProfile';
import AboutStory from './AboutStory';
import KeyAccomplishments from './KeyAccomplishments';
import SocialStatisticsGrid from './SocialStatisticsGrid';
import TechnicalSkillsGrid from './TechnicalSkillsGrid';
import AccomplishmentsDisplay from './AccomplishmentsDisplay';
import TestimonialsSection from './TestimonialsSection';
import ConnectWithMe from './ConnectWithMe';

const AboutSection: React.FC = () => {
  // Create separate ref and inView state for each section for better control
  const { ref: profileSectionRef, inView: profileSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: accomplishmentsSectionRef, inView: accomplishmentsSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: statsSectionRef, inView: statsSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: skillsSectionRef, inView: skillsSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: accomplishmentsListRef, inView: accomplishmentsListInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: connectSectionRef, inView: connectSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { ref: testimonialsSectionRef, inView: testimonialsSectionInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <div className="bg-elvis-dark text-white py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile and Story Section */}
        <motion.div 
          ref={profileSectionRef}
          className="mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <AboutProfile isInView={profileSectionInView} />
            </div>
            
            <div className="lg:col-span-8">
              <AboutStory isInView={profileSectionInView} />
            </div>
          </div>
        </motion.div>
        
        {/* Key Accomplishments */}
        <motion.div 
          ref={accomplishmentsSectionRef}
          className="mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: profileSectionInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <KeyAccomplishments isInView={accomplishmentsSectionInView} />
        </motion.div>
        
        {/* Social Statistics */}
        <motion.div 
          ref={statsSectionRef}
          className="mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: accomplishmentsSectionInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SocialStatisticsGrid isInView={statsSectionInView} />
        </motion.div>
        
        {/* Technical Skills */}
        <motion.div 
          ref={skillsSectionRef}
          className="mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: statsSectionInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-1 h-6 bg-purple-500 mr-3"></div>
            <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
          </div>
          <TechnicalSkillsGrid isInView={skillsSectionInView} />
        </motion.div>
        
        {/* Accomplishments List */}
        <motion.div 
          ref={accomplishmentsListRef}
          className="mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: skillsSectionInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AccomplishmentsDisplay isInView={accomplishmentsListInView} />
        </motion.div>
        
        {/* Connect With Me */}
        <motion.div 
          ref={connectSectionRef}
          className="mb-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: accomplishmentsListInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ConnectWithMe isInView={connectSectionInView} />
        </motion.div>
        
        {/* Testimonials */}
        <motion.div 
          ref={testimonialsSectionRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: connectSectionInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TestimonialsSection isInView={testimonialsSectionInView} />
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
