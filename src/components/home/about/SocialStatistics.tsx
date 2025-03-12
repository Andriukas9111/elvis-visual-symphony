
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStats } from '@/hooks/api/useStats';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SocialStatisticsProps {
  isInView: boolean;
}

const SocialStatistics: React.FC<SocialStatisticsProps> = ({ isInView }) => {
  const { data: stats, isLoading, error } = useStats();
  const [counters, setCounters] = useState<{[key: string]: number}>({});
  const animationRef = useRef<{[key: string]: NodeJS.Timeout | null}>({});
  const hasAnimated = useRef<boolean>(false);

  // Default stats
  const defaultStats = [
    { id: '1', icon_name: 'Camera', value: 8, suffix: '+', label: 'Projects', tab: 'projects', description: 'Creating stunning visuals for diverse clients' },
    { id: '2', icon_name: 'Video', value: 100, suffix: '+', label: 'Projects filmed & edited', tab: 'filmed', description: 'From concept to final delivery' },
    { id: '3', icon_name: 'Users', value: 37, suffix: 'K+', label: 'Followers', tab: 'followers', description: 'Growing community of engaged viewers' },
    { id: '4', icon_name: 'Eye', value: 10, suffix: 'M+', label: 'Views', tab: 'views', description: 'Reaching millions across platforms' },
    { id: '5', icon_name: 'Star', value: 98, suffix: '%', label: 'Engagement', tab: 'engagement', description: 'High engagement rate with followers' }
  ];

  // Filter social statistics
  const socialStats = stats?.filter(
    stat => ['Camera', 'Video', 'Users', 'Eye', 'Star'].includes(stat.icon_name)
  ) || [];

  const displayStats = socialStats.length > 0 ? socialStats : defaultStats;

  // Ensure all stats have tab property
  const processedStats = displayStats.map((stat, index) => ({
    ...stat,
    tab: stat.tab || `tab-${index}`,
    description: stat.description || stat.label
  }));

  useEffect(() => {
    // Initialize counters to zero
    const initialCounters: {[key: string]: number} = {};
    processedStats.forEach(stat => {
      initialCounters[stat.id] = 0;
    });
    setCounters(initialCounters);
    
    // Clear any existing animation timeouts when component unmounts
    return () => {
      Object.values(animationRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [processedStats]);

  useEffect(() => {
    // Only start animations when section is in view and hasn't animated yet
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      // Animate each counter
      processedStats.forEach(stat => {
        animateValue(stat.id, 0, stat.value, 1500);
      });
    }
  }, [isInView, processedStats]);

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
      'bg-pink-600', // Views
      'bg-blue-600'  // Engagement
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
      
      <Tabs defaultValue={processedStats[0]?.tab || "projects"} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-elvis-dark">
          {processedStats.map((stat) => (
            <TabsTrigger
              key={stat.id}
              value={stat.tab}
              className="text-sm"
            >
              {stat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {processedStats.map((stat, index) => (
          <TabsContent key={stat.id} value={stat.tab}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className={`${getBgColor(index)} rounded-xl p-8 relative overflow-hidden`}
            >
              <div className="flex items-center mb-4">
                <div className="text-white">
                  {getIconByName(stat.icon_name, "h-8 w-8")}
                </div>
                <h3 className="text-4xl font-bold text-white ml-4">
                  {counters[stat.id] || 0}{stat.suffix}
                </h3>
              </div>
              <p className="text-white/80 text-lg mt-2">
                {stat.description}
              </p>
              <div className="absolute top-2 right-2 opacity-20">
                {getIconByName(stat.icon_name, "h-24 w-24 text-white")}
              </div>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SocialStatistics;
