
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StatProps {
  id: number;
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
}

interface StatCounterProps {
  stat: StatProps;
  index: number;
  isInView: boolean;
}

const StatCounter = ({ stat, index, isInView }: StatCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      setCount(Math.floor(stat.value * progress));
      
      if (frame === totalFrames) {
        clearInterval(timer);
        setCount(stat.value);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [isInView, stat.value]);

  return (
    <motion.div
      key={stat.id}
      className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center hover:border-elvis-pink/30 border border-white/5 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
    >
      <div className="mb-2 bg-elvis-medium/80 w-12 h-12 rounded-full flex items-center justify-center shadow-pink-glow">
        <div className="text-elvis-pink">
          {stat.icon}
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-bold text-elvis-pink">
        {count}{stat.suffix}
      </div>
      <div className="text-sm text-white/70 mt-1">{stat.label}</div>
    </motion.div>
  );
};

export default StatCounter;
