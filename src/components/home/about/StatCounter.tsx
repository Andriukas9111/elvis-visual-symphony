
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface StatProps {
  stat: {
    id: string;
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    abbreviate?: boolean;
  };
  index: number;
  isInView: boolean;
}

// Function to format numbers (e.g., 1000000 to 1M)
const formatNumber = (num: number, abbreviate: boolean = true): string => {
  if (!abbreviate || num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
};

const StatCounter: React.FC<StatProps> = ({ stat, index, isInView }) => {
  const [count, setCount] = useState(0);
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

  const displayValue = formatNumber(count, stat.abbreviate !== false);
  const exactValue = new Intl.NumberFormat().format(stat.value);

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
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-2xl md:text-3xl font-bold text-white cursor-help">
              {displayValue}{stat.suffix}
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-elvis-dark border-elvis-pink/20 text-white">
            <p>{exactValue}{stat.suffix}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="text-sm text-white/80">
        {stat.label}
      </div>
    </motion.div>
  );
};

export default StatCounter;
