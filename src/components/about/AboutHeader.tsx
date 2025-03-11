
import React from 'react';
import { motion } from 'framer-motion';

interface AboutHeaderProps {
  title: string;
  subtitle?: string;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({ title, subtitle }) => {
  const titleParts = title.split(' ');
  const firstPart = titleParts[0];
  const restParts = titleParts.slice(1).join(' ');

  return (
    <div className="py-16 max-w-4xl mx-auto text-center">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {firstPart}{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{restParts}</span>
      </motion.h1>
      
      {subtitle && (
        <motion.p 
          className="text-lg text-white/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default AboutHeader;
