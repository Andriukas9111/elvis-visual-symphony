
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '@/hooks/api/useStats';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';
import { Loader2 } from 'lucide-react';

interface SocialStatisticsProps {
  isInView: boolean;
}

const SocialStatistics: React.FC<SocialStatisticsProps> = ({ isInView }) => {
  const { data: stats, isLoading, error } = useStats();
  const [counters, setCounters] = useState<{[key: string]: number}>({});
  const animationRef = useRef<{[key: string]: NodeJS.Timeout | null}>({});
  const hasAnimated = useRef<boolean>(false);

  // Default stats in case database is empty
  const defaultStats = [
    { id: '1', icon_name: 'Camera', value: 8, suffix: '+', label: 'Projects' },
    { id: '2', icon_name: 'Video', value: 100, suffix: '+', label: 'Projects filmed & edited' },
    { id: '3', icon_name: 'Users', value: 37, suffix: 'K+', label: 'Followers' },
    { id: '4', icon_name: 'Eye', value: 10, suffix: 'M+', label: 'Views across social media' }
  ];

  // Filter social statistics - typically camera, video, users, eye icons
  const socialStats = stats && stats.length > 0 ? stats.filter(
    stat => ['Camera', 'Video', 'Users', 'Eye', 'Calendar', 'Trophy', 'Star'].includes(stat.icon_name)
  ) : [];

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

  // Function to get the background color based on index
  const getBgColor = (index: number) => {
    const colors = [
      'bg-pink-600', // Projects
      'bg-pink-600', // Projects filmed & edited
      'bg-blue-600', // Followers
      'bg-pink-600'  // Views
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
          Social Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-elvis-dark/40 rounded-xl p-5 h-32"/>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading social statistics:", error);
    return (
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
          Social Statistics
        </h3>
        <div className="bg-red-900/20 p-4 rounded-lg">
          <p className="text-white/80">Unable to load statistics. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Social Statistics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${getBgColor(index)} rounded-xl p-5 relative overflow-hidden`}
          >
            <div className="flex items-center mb-2">
              <div className="text-white">
                {getIconByName(stat.icon_name, "h-6 w-6")}
              </div>
            </div>
            <div className="z-10 relative">
              <h3 className="text-3xl font-bold text-white">
                {counters[stat.id] || 0}
                {stat.suffix}
              </h3>
              <p className="text-white text-sm mt-1 opacity-80">{stat.label}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-20">
              {getIconByName(stat.icon_name, "h-16 w-16 text-white")}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SocialStatistics;
