
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
    <div className="grid grid-cols-2 gap-6 mt-8">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.id}
          className="glass-card rounded-xl p-5 border border-white/5 hover:border-elvis-pink/30 transition-all"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 + (index * 0.15) }}
          whileHover={{ 
            y: -8, 
            boxShadow: '0 15px 30px -10px rgba(255, 0, 255, 0.4)',
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 bg-elvis-medium/80 w-14 h-14 rounded-full flex items-center justify-center shadow-pink-glow">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              >
                {stat.icon}
              </motion.div>
            </div>
            <motion.div 
              className="text-3xl font-bold text-gradient mb-2"
              key={counters[index]}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {counters[index]}{stat.value.includes('+') ? '+' : ''}
            </motion.div>
            <div className="text-sm font-medium text-white/70">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
