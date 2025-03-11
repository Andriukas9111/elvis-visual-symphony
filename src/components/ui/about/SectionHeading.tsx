
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUpVariant } from '@/types/about.types';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  accent?: 'pink' | 'purple' | 'blue';
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false, 
  accent = 'pink',
  className = ''
}) => {
  const accentColors = {
    pink: 'from-elvis-pink to-elvis-purple',
    purple: 'from-elvis-purple to-blue-500',
    blue: 'from-blue-500 to-elvis-pink'
  };
  
  return (
    <div className={`${centered ? 'text-center' : ''} mb-8 md:mb-12 ${className}`}>
      <motion.h2 
        className="inline-block text-3xl md:text-4xl font-bold relative"
        variants={fadeInUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        custom={0}
      >
        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${accentColors[accent]}`}>
          {title}
        </span>
        <motion.div 
          className={`absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r ${accentColors[accent]} rounded-full`}
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        />
      </motion.h2>
      
      {subtitle && (
        <motion.p
          className="text-white/70 mt-4 max-w-3xl mx-auto"
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          custom={1}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
