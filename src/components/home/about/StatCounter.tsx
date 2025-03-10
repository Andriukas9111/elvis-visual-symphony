
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export interface StatProps {
  stat: {
    id: string; // Changed from number to string to match database
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
  };
  index: number;
  isInView: boolean;
}

const StatCounter: React.FC<StatProps> = ({ stat, index, isInView }) => {
  const [count, setCount] = React.useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  React.useEffect(() => {
    if (!isInView || !inView) return;
    
    // Only animate if both parent and self are in view
    let startTime: number;
    let animationFrameId: number;
    const duration = 2000 + (index * 100); // Staggered durations
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      setCount(Math.floor(easedProgress * stat.value));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateCount);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, inView, stat.value, index]);

  return (
    <motion.div 
      ref={ref}
      className="flex flex-col items-center text-center space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center justify-center w-14 h-14 bg-elvis-dark/30 rounded-full border border-elvis-pink/30 mb-2">
        {stat.icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-white">
        {count}{stat.suffix}
      </div>
      <div className="text-sm text-white/80">
        {stat.label}
      </div>
    </motion.div>
  );
};

export default StatCounter;
