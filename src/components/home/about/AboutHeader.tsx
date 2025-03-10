
import React from 'react';
import { motion } from 'framer-motion';

interface AboutHeaderProps {
  isInView: boolean;
}

const AboutHeader = ({ isInView }: AboutHeaderProps) => {
  return (
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative inline-block">
        <motion.h2 
          className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <span className="relative z-10">About </span>
          <span className="text-gradient font-script relative z-10">Elvis Creative</span>
        </motion.h2>
        <motion.div 
          className="absolute -bottom-3 left-0 h-3 bg-elvis-gradient rounded-full z-0"
          initial={{ width: 0 }}
          animate={isInView ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <motion.p 
        className="text-white/70 text-xl max-w-2xl mx-auto mt-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        I'm a professional videographer and cinematographer with over 8 years of experience 
        creating visual stories that captivate and inspire audiences worldwide.
      </motion.p>
    </motion.div>
  );
};

export default AboutHeader;
