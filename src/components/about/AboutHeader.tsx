
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
    <div className="py-20 px-4 max-w-4xl mx-auto text-center">
      <motion.h1 
        className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {firstPart}{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">{restParts}</span>
      </motion.h1>
      
      {subtitle && (
        <motion.p 
          className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
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
