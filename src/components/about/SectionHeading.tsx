
import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="flex items-center mb-8 md:mb-12">
      <motion.div 
        className="w-1 h-10 bg-elvis-pink mr-4"
        initial={{ height: 0 }}
        animate={{ height: 40 }}
        transition={{ duration: 0.5 }}
      />
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-white/70 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SectionHeading;
