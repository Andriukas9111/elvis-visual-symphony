
import React from 'react';
import { motion } from 'framer-motion';
import { StatData } from './types';
import { useStats } from '@/hooks/api/useStats';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';

const SocialStatisticsGrid: React.FC = () => {
  const { data: stats, isLoading } = useStats();
  
  // Placeholder data when API data is not available
  const defaultStats: StatData[] = [
    {
      id: "1",
      title: "Instagram Followers",
      value: 125000,
      icon_name: "Instagram",
      prefix: "",
      suffix: "+",
      label: "Followers"
    },
    {
      id: "2",
      title: "YouTube Subscribers",
      value: 45000,
      icon_name: "Youtube",
      prefix: "",
      suffix: "+",
      label: "Subscribers"
    },
    {
      id: "3",
      title: "Video Views",
      value: 2500000,
      icon_name: "Play",
      prefix: "",
      suffix: "+",
      label: "Views"
    }
  ];
  
  const displayStats = stats && stats.length > 0 ? stats : defaultStats;
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {displayStats.map((stat) => {
        const formattedValue = formatNumber(stat.value);
        const icon = stat.icon_name ? getIconByName(stat.icon_name) : null;
        
        return (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            className="bg-elvis-dark-secondary rounded-xl p-6 flex flex-col items-center justify-center text-center"
          >
            {icon && <div className="mb-4">{icon}</div>}
            
            <h3 className="text-3xl font-bold text-white">
              {stat.prefix}{formattedValue}{stat.suffix}
            </h3>
            
            <p className="text-elvis-light mt-2">
              {stat.label || stat.title}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SocialStatisticsGrid;
