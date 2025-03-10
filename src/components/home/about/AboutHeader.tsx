
import React from 'react';
import { motion } from 'framer-motion';

interface AboutHeaderProps {
  isInView: boolean;
}

const AboutHeader = ({ isInView }: AboutHeaderProps) => {
  return (
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter"
      >
        <span>About </span>
        <span className="text-gradient font-script">Elvis Creative</span>
      </motion.h2>
      
      <motion.div 
        className="h-1 w-24 bg-elvis-gradient mx-auto mb-6"
        initial={{ width: 0 }}
        animate={isInView ? { width: 96 } : { width: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      
      <motion.p 
        className="text-white/70 text-lg max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        I'm a professional videographer and cinematographer with over 8 years of experience creating visual stories that captivate and inspire.
      </motion.p>
    </motion.div>
  );
};

export default AboutHeader;
