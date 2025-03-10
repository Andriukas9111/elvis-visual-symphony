
import React from 'react';
import { motion } from 'framer-motion';
import { StatItem } from './types';

interface StatsGridProps {
  stats: StatItem[];
  counters: number[];
  isInView: boolean;
}

const StatsGrid = ({ stats, counters, isInView }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.id}
          className="glass-card rounded-xl p-4 border border-white/5 hover:border-elvis-pink/20 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(255, 0, 255, 0.3)' }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 bg-elvis-medium/80 w-12 h-12 rounded-full flex items-center justify-center shadow-pink-glow">
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gradient mb-1">
              {counters[index]}{stat.value.includes('+') ? '+' : ''}
            </div>
            <div className="text-xs text-white/60">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
