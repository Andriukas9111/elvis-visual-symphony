
import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUpVariant } from '@/types/about.types';
import { getDynamicIcon } from '@/utils/iconUtils';

interface StatCardProps {
  id: string;
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  abbreviate?: boolean;
  index?: number;
  color?: 'pink' | 'purple' | 'blue' | 'teal' | 'yellow';
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'pink':
      return {
        bg: 'bg-elvis-pink/10',
        text: 'text-elvis-pink',
        border: 'border-elvis-pink/20'
      };
    case 'purple':
      return {
        bg: 'bg-elvis-purple/10',
        text: 'text-elvis-purple',
        border: 'border-elvis-purple/20'
      };
    case 'blue':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20'
      };
    case 'teal':
      return {
        bg: 'bg-teal-500/10',
        text: 'text-teal-400',
        border: 'border-teal-500/20'
      };
    case 'yellow':
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20'
      };
    default:
      return {
        bg: 'bg-elvis-pink/10',
        text: 'text-elvis-pink',
        border: 'border-elvis-pink/20'
      };
  }
};

const abbreviateNumber = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value;
};

const StatCard: React.FC<StatCardProps> = ({ 
  id, 
  icon, 
  value, 
  suffix = '', 
  prefix = '', 
  label, 
  abbreviate = false,
  index = 0,
  color = 'pink'
}) => {
  const colorClasses = getColorClasses(color);
  const Icon = typeof icon === 'string' ? getDynamicIcon(icon as string) : null;
  const displayValue = abbreviate ? abbreviateNumber(value) : value;
  
  return (
    <motion.div
      key={id}
      className={`bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-6 rounded-xl border ${colorClasses.border} shadow-md`}
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
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className={`${colorClasses.bg} p-3 rounded-full`}>
          {Icon ? (
            <Icon className={`h-5 w-5 ${colorClasses.text}`} strokeWidth={1.5} />
          ) : (
            icon
          )}
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-white">
            {prefix}{displayValue}{suffix}
          </h3>
          <p className="text-white/70 mt-1">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
