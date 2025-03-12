
import React from 'react';
import { motion } from 'framer-motion';

interface DecoratedSectionHeaderProps {
  title: string;
  subtitle?: string;
  isInView: boolean;
}

const DecoratedSectionHeader: React.FC<DecoratedSectionHeaderProps> = ({ 
  title, 
  subtitle, 
  isInView 
}) => {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-elvis-pink to-elvis-purple">
            {title}
          </span>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-elvis-pink to-elvis-purple rounded-full"></div>
        </h2>
      </motion.div>
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/70 mt-4 max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default DecoratedSectionHeader;
