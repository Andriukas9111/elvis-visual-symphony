import React from 'react';
import { motion } from 'framer-motion';

export interface AboutHeaderProps {
  isInView: boolean;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({ isInView }) => {
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
        Professional videographer and cinematographer with over 8 years of experience 
        creating visual stories that captivate and inspire audiences worldwide.
      </motion.p>
      
      {/* Visual elements */}
      <motion.div 
        className="absolute left-1/4 -mt-10 w-6 h-6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="w-full h-full rounded-full bg-elvis-pink/20 animate-pulse"></div>
      </motion.div>
      
      <motion.div 
        className="absolute right-1/4 mt-10 w-4 h-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="w-full h-full rounded-full bg-elvis-purple/20 animate-pulse"></div>
      </motion.div>
    </motion.div>
  );
};

export default AboutHeader;
