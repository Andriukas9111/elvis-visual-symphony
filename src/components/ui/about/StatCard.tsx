
import React from 'react';
import { motion } from 'framer-motion';
import { Statistic } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { LucideIcon } from 'lucide-react';
import { getDynamicIcon } from '@/utils/iconUtils';

interface StatCardProps {
  stat: Statistic;
  index: number;
  variant?: 'default' | 'social' | 'accent';
}

const StatCard: React.FC<StatCardProps> = ({ 
  stat, 
  index,
  variant = 'default'
}) => {
  const Icon = getDynamicIcon(stat.icon_name);
  
  const formatValue = (value: number): string => {
    // Format large numbers
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return value.toString();
  };
  
  // Variant-specific styling
  const getVariantClasses = () => {
    switch (variant) {
      case 'social':
        return 'bg-elvis-dark/80 border-elvis-purple/20 p-5';
      case 'accent':
        const colors = [
          'from-purple-900/80 to-purple-800/80',
          'from-blue-900/80 to-blue-800/80',
          'from-green-900/80 to-green-800/80',
          'from-amber-900/80 to-amber-800/80',
          'from-rose-900/80 to-rose-800/80'
        ];
        return `bg-gradient-to-br ${colors[index % colors.length]} p-5 border-white/10`;
      default:
        return 'bg-gradient-to-br from-elvis-darker to-elvis-dark/60 border-elvis-medium/20 p-6';
    }
  };
  
  const iconContainerClasses = variant === 'accent' 
    ? 'bg-black/20 p-3 rounded-full' 
    : 'bg-elvis-purple/10 p-3 rounded-full';
  
  return (
    <motion.div
      className={`rounded-xl border ${getVariantClasses()} flex flex-col items-center text-center h-full shadow-lg backdrop-blur-sm`}
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={iconContainerClasses}>
        <Icon className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-3xl font-bold text-white mt-3 mb-1 tracking-tight">
        {formatValue(stat.value)}{stat.suffix || ''}
      </h3>
      
      <p className="text-white/70 text-sm">{stat.label}</p>
    </motion.div>
  );
};

export default StatCard;
