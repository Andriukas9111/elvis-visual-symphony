
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '@/hooks/api/useStats';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';

interface SocialStatisticsProps {
  isInView: boolean;
}

const SocialStatistics: React.FC<SocialStatisticsProps> = ({ isInView }) => {
  const { data: stats, isLoading } = useStats();
  const [counters, setCounters] = useState<{[key: string]: number}>({});
  const animationRef = useRef<{[key: string]: NodeJS.Timeout | null}>({});
  const hasAnimated = useRef<boolean>(false);
  
  // Default stats in case database is empty
  const defaultStats = [
    { id: '1', icon_name: 'Camera', value: 300, suffix: '+', label: 'Projects' },
    { id: '2', icon_name: 'Video', value: 5, suffix: 'M+', label: 'Views' },
    { id: '3', icon_name: 'Users', value: 100, suffix: '+', label: 'Clients' },
    { id: '4', icon_name: 'Eye', value: 500, suffix: 'K+', label: 'Impressions' }
  ];
  
  // Filter social statistics - typically camera, video, users, eye icons
  const socialStats = stats?.filter(
    stat => ['Camera', 'Video', 'Users', 'Eye'].includes(stat.icon_name)
  ) || [];
  
  // Use stats from database or fallback to defaults
  const displayStats = socialStats.length > 0 ? socialStats : defaultStats;
  
  useEffect(() => {
    // Initialize counters to zero
    const initialCounters: {[key: string]: number} = {};
    displayStats.forEach(stat => {
      initialCounters[stat.id] = 0;
    });
    setCounters(initialCounters);
    
    // Clear any existing animation timeouts when component unmounts
    return () => {
      Object.values(animationRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [displayStats]);
  
  useEffect(() => {
    // Only start animations when section is in view and hasn't animated yet
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      // Animate each counter
      displayStats.forEach(stat => {
        animateValue(stat.id, 0, stat.value, 1500);
      });
    }
  }, [isInView, displayStats]);
  
  // Animation function for counting up
  const animateValue = (id: string, start: number, end: number, duration: number) => {
    let startTimestamp: number | null = null;
    const newAnimationRef: {[key: string]: NodeJS.Timeout | null} = {...animationRef.current};
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      
      setCounters(prev => ({...prev, [id]: value}));
      
      if (progress < 1) {
        newAnimationRef[id] = setTimeout(() => requestAnimationFrame(step), 10);
      }
    };
    
    requestAnimationFrame(step);
    animationRef.current = newAnimationRef;
  };
  
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Social Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-elvis-dark/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 flex flex-col"
          >
            <div className="flex items-center mb-2">
              {getIconByName(stat.icon_name, "text-elvis-pink h-5 w-5 mr-2")}
              <h4 className="text-white/80 text-sm">{stat.label}</h4>
            </div>
            <h3 className="text-3xl font-bold text-white mt-auto">
              {counters[stat.id] || 0}
              <span className="ml-1 text-elvis-pink">{stat.suffix}</span>
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SocialStatistics;
