
import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/api/useContent';
import { StatItem } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';

interface StatisticsSectionProps {
  isInView: boolean;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ isInView }) => {
  const { data: contentData, isLoading } = useContent('statistics');
  
  // Parse statistics from content data
  const stats = React.useMemo(() => {
    if (!contentData || contentData.length === 0) return [];
    
    const statsData = contentData.find(item => item.content && item.section === 'statistics');
    
    if (!statsData || !statsData.content) return [];
    
    try {
      return JSON.parse(statsData.content) as StatItem[];
    } catch (error) {
      console.error("Error parsing statistics data:", error);
      return [];
    }
  }, [contentData]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Skeleton className="h-6 w-1 mr-3" />
          <Skeleton className="h-6 w-48" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <span className="h-6 w-1 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-xl font-bold">By the Numbers</h3>
      </div>
      
      <div className="space-y-4">
        {stats && stats.length > 0 ? (
          stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView 
                ? { opacity: 1, x: 0, transition: { delay: 0.1 * index, duration: 0.5 } } 
                : { opacity: 0, x: -20 }
              }
            >
              <div className="flex items-center">
                <div className="text-elvis-pink mr-4">
                  {getIconByName(stat.icon_name)}
                </div>
                <div>
                  <h4 className="text-2xl font-bold">
                    {stat.value}
                    {stat.suffix && <span>{stat.suffix}</span>}
                  </h4>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-white/50 py-8">
            No statistics available yet
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsSection;
