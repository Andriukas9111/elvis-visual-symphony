
import React from 'react';
import { motion } from 'framer-motion';
import { useStatistics } from '@/hooks/api/useStatistics';
import StatCard from '@/components/ui/about/StatCard';
import { staggerContainer } from '@/types/about.types';

const SocialStatistics: React.FC = () => {
  const { data: statistics = [], isLoading } = useStatistics('social');
  
  // Default stats in case database is empty
  const defaultStats = [
    { 
      id: '1', 
      icon_name: 'Camera', 
      value: 1500, 
      suffix: '+', 
      label: 'Videos Created',
      category: 'social',
      sort_order: 0,
      created_at: '',
      updated_at: ''
    },
    { 
      id: '2', 
      icon_name: 'Video', 
      value: 5, 
      suffix: 'M+', 
      label: 'Views', 
      category: 'social',
      sort_order: 1,
      created_at: '',
      updated_at: ''
    },
    { 
      id: '3', 
      icon_name: 'Users', 
      value: 250, 
      suffix: 'K+', 
      label: 'Subscribers', 
      category: 'social',
      sort_order: 2,
      created_at: '',
      updated_at: ''
    },
    { 
      id: '4', 
      icon_name: 'Eye', 
      value: 10, 
      suffix: 'M+', 
      label: 'Impressions', 
      category: 'social',
      sort_order: 3,
      created_at: '',
      updated_at: ''
    }
  ];
  
  // Use stats from the database or fallback to defaults
  const displayStats = statistics.length > 0 ? statistics : defaultStats;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-elvis-medium/20 rounded-xl h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
    >
      {displayStats.map((stat, index) => (
        <StatCard 
          key={stat.id} 
          stat={stat} 
          index={index}
          variant="social"
        />
      ))}
    </motion.div>
  );
};

export default SocialStatistics;
