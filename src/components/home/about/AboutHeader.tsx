
import React from 'react';
import { motion } from 'framer-motion';

const AboutHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-5xl md:text-6xl font-bold mb-4 flex items-center justify-center">
        About 
        <span className="text-elvis-pink ml-3 font-cursive">Elvis Creative</span>
      </h2>
      
      <motion.div 
        className="w-32 h-1 bg-elvis-pink mx-auto mb-8"
        initial={{ width: 0 }}
        animate={{ width: '8rem' }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      
      <p className="text-white/80 max-w-3xl mx-auto text-lg">
        Professional videographer and cinematographer with over 8 years 
        of experience creating visual stories that captivate and inspire 
        audiences worldwide.
      </p>
    </div>
  );
};

export default AboutHeader;
