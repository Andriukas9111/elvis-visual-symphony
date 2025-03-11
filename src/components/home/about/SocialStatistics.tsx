
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '@/hooks/api/useStats';
import { Camera, Video, Users, Eye } from 'lucide-react';

interface SocialStatisticsProps {
  isInView: boolean;
}

const SocialStatistics: React.FC<SocialStatisticsProps> = ({ isInView }) => {
  const { data: stats, isLoading } = useStats();
  const [counters, setCounters] = useState<{[key: string]: number}>({});
  const animationRef = useRef<{[key: string]: NodeJS.Timeout | null}>({});
  
  // Default stats in case database is empty
  const defaultStats = [
    { id: '1', icon_name: 'Camera', value: 8, suffix: '+', label: 'Projects' },
    { id: '2', icon_name: 'Video', value: 100, suffix: '+', label: 'Projects filmed & edited' },
    { id: '3', icon_name: 'Users', value: 37000, suffix: '+', label: 'Followers' },
    { id: '4', icon_name: 'Eye', value: 10, suffix: 'M+', label: 'Views across social media' }
  ];

  // Use stats from the database or fallback to defaults
  const displayStats = stats && stats.length ? stats.slice(0, 4) : defaultStats;

  // Initialize counters when stats are loaded or isInView changes
  useEffect(() => {
    // Clear any existing animations
    Object.values(animationRef.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });
    
    // Reset animation references
    animationRef.current = {};
    
    // Initialize counters at 0
    const initialCounters: {[key: string]: number} = {};
    displayStats.forEach(stat => {
      initialCounters[stat.id] = 0;
    });
    setCounters(initialCounters);
    
    // Start animations if in view
    if (isInView) {
      displayStats.forEach((stat, index) => {
        const targetValue = parseInt(stat.value.toString());
        animateStat(stat.id, targetValue, index);
      });
    }
    
    // Cleanup on unmount
    return () => {
      Object.values(animationRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [isInView, stats]);
  
  // Animate a single stat
  const animateStat = (id: string, targetValue: number, index: number) => {
    const duration = 2000;
    const startDelay = index * 100;
    const startTime = Date.now() + startDelay;
    const endTime = startTime + duration;
    
    const updateCounter = () => {
      const now = Date.now();
      
      // If animation hasn't started yet, schedule it
      if (now < startTime) {
        animationRef.current[id] = setTimeout(updateCounter, 16);
        return;
      }
      
      // If animation is complete, set final value
      if (now >= endTime) {
        setCounters(prev => ({ ...prev, [id]: targetValue }));
        animationRef.current[id] = null;
        return;
      }
      
      // Calculate current value based on time elapsed
      const elapsedRatio = (now - startTime) / duration;
      // Use easeOutQuad for smoother animation
      const easedRatio = 1 - (1 - elapsedRatio) * (1 - elapsedRatio);
      const currentValue = Math.floor(targetValue * easedRatio);
      
      setCounters(prev => ({ ...prev, [id]: currentValue }));
      animationRef.current[id] = setTimeout(updateCounter, 16);
    };
    
    // Start the animation
    updateCounter();
  };

  // Get the appropriate icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera size={24} className="text-white" />;
      case 'Video':
        return <Video size={24} className="text-white" />;
      case 'Users':
        return <Users size={24} className="text-white" />;
      case 'Eye':
        return <Eye size={24} className="text-white" />;
      default:
        return <Camera size={24} className="text-white" />;
    }
  };

  // Colors for the cards
  const bgColors = [
    'bg-pink-600',
    'bg-purple-600',
    'bg-blue-600',
    'bg-indigo-600'
  ];

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Social Statistics
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${bgColors[index % bgColors.length]} rounded-2xl p-5 flex flex-col items-center`}
          >
            <div className="flex items-center mb-2">
              {getIcon(stat.icon_name)}
            </div>
            <h3 className="text-2xl font-bold text-white">
              {formatNumber(counters[stat.id] || 0)}{stat.suffix}
            </h3>
            <p className="text-white/80 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SocialStatistics;
