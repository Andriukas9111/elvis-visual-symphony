
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUpVariant, AccentColor } from '@/types/about.types';
import { getDynamicIcon } from '@/utils/iconUtils';

interface StatCardProps {
  id: string;
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  abbreviate?: boolean;
  index: number;
  color?: AccentColor;
}

const StatCard: React.FC<StatCardProps> = ({
  id,
  icon,
  value,
  suffix = '',
  prefix = '',
  label,
  abbreviate = false,
  index,
  color = 'pink'
}) => {
  const formatValue = (val: number): string => {
    if (!abbreviate) return val.toString();
    
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toString();
  };
  
  // Generate color classes based on color prop
  const colorClasses = {
    pink: 'from-elvis-pink/20 to-elvis-purple/10 border-elvis-pink/30 text-elvis-pink',
    purple: 'from-elvis-purple/20 to-elvis-blue/10 border-elvis-purple/30 text-elvis-purple',
    blue: 'from-elvis-blue/20 to-elvis-teal/10 border-elvis-blue/30 text-elvis-blue',
    teal: 'from-elvis-teal/20 to-elvis-green/10 border-elvis-teal/30 text-elvis-teal',
    yellow: 'from-elvis-yellow/20 to-elvis-orange/10 border-elvis-yellow/30 text-elvis-yellow'
  };
  
  const gradientClasses = colorClasses[color] || colorClasses.pink;
  const textColorClass = `text-${color === 'pink' ? 'elvis-pink' : color === 'purple' ? 'elvis-purple' : color === 'blue' ? 'elvis-blue' : color === 'teal' ? 'elvis-teal' : 'elvis-yellow'}`;
  
  // Handle icon as string or ReactNode
  const IconComponent = typeof icon === 'string' ? getDynamicIcon(icon) : null;
  
  return (
    <motion.div 
      className={`bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-6 rounded-xl border border-elvis-medium/20 shadow-md`}
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`p-3 rounded-full mb-3 bg-gradient-to-br ${gradientClasses}`}>
          {IconComponent ? (
            <IconComponent className="h-6 w-6 text-white" strokeWidth={1.5} />
          ) : (
            icon
          )}
        </div>
        
        <div className="flex items-baseline">
          {prefix && <span className="text-white text-lg mr-1">{prefix}</span>}
          <span className="text-3xl sm:text-4xl font-bold text-white">{formatValue(value)}</span>
          {suffix && <span className="text-white text-lg ml-1">{suffix}</span>}
        </div>
        
        <p className="mt-2 text-white/70">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
