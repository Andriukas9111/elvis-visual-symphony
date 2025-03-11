
import React from 'react';
import { motion } from 'framer-motion';
import { AccentColor } from '@/types/about.types';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  accent?: AccentColor;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false,
  accent = "pink"
}) => {
  // Map accent color to gradient classes
  const accentMap = {
    pink: "from-elvis-pink/20 to-elvis-purple/10 border-elvis-pink/30",
    purple: "from-elvis-purple/20 to-elvis-blue/10 border-elvis-purple/30",
    blue: "from-elvis-blue/20 to-elvis-teal/10 border-elvis-blue/30",
    teal: "from-elvis-teal/20 to-elvis-green/10 border-elvis-teal/30",
    yellow: "from-elvis-yellow/20 to-elvis-orange/10 border-elvis-yellow/30"
  };

  const gradientClasses = accentMap[accent];

  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      <motion.h2 
        className={`inline-block text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r ${gradientClasses} px-6 py-2 rounded-full border`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          className="text-lg text-white/70 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
