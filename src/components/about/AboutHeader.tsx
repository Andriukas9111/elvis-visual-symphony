
import React from 'react';
import { motion } from 'framer-motion';

interface AboutHeaderProps {
  title: string;
  subtitle: string;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({ title, subtitle }) => {
  // Split the title to style "Elvis Creative" part differently
  const titleParts = title.split('Elvis Creative');
  
  return (
    <motion.div 
      className="mb-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        {titleParts[0]}
        <span className="text-elvis-pink font-script">Elvis Creative</span>
        {titleParts[1]}
      </h1>
      <p className="text-white/80 max-w-3xl mx-auto text-lg">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default AboutHeader;
