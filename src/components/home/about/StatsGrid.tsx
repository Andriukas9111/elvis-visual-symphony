
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
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center hover:border-elvis-pink/30 border border-white/5 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="mb-2 bg-elvis-medium/80 w-12 h-12 rounded-full flex items-center justify-center shadow-pink-glow">
            <motion.div 
              className="text-elvis-pink"
              whileHover={{ rotate: 5 }}
              animate={{ 
                boxShadow: ['0 0 0 rgba(255, 0, 255, 0.3)', '0 0 20px rgba(255, 0, 255, 0.6)', '0 0 0 rgba(255, 0, 255, 0.3)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stat.icon}
            </motion.div>
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-elvis-pink">
            {stat.value.includes('+') ? counters[index] + '+' : counters[index]}
          </div>
          <div className="text-sm text-white/70 mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
