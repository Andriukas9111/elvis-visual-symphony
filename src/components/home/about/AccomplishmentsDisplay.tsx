
import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/hooks/api/useContent';
import { AccomplishmentData } from './types';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';

interface AccomplishmentsDisplayProps {
  isInView: boolean;
}

const AccomplishmentsDisplay: React.FC<AccomplishmentsDisplayProps> = ({ isInView }) => {
  const { data: contentData, isLoading } = useContent('accomplishments');
  
  // Parse accomplishments from content data
  const accomplishments = React.useMemo(() => {
    if (!contentData || contentData.length === 0) return [];
    
    const accomplishmentsData = contentData.find(item => item.content && item.section === 'accomplishments');
    
    if (!accomplishmentsData || !accomplishmentsData.content) return [];
    
    try {
      return JSON.parse(accomplishmentsData.content) as AccomplishmentData[];
    } catch (error) {
      console.error("Error parsing accomplishments data:", error);
      return [];
    }
  }, [contentData]);
  
  if (isLoading) {
    return (
      <div className="pt-6 animate-pulse">
        <div className="flex items-center mb-4">
          <span className="h-6 w-1 bg-elvis-pink/30 rounded-full mr-3"></span>
          <div className="h-7 w-64 bg-white/10 rounded"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!accomplishments || accomplishments.length === 0) {
    return null;
  }
  
  return (
    <div className="pt-6">
      <div className="flex items-center mb-6">
        <span className="h-6 w-1 bg-elvis-pink rounded-full mr-3"></span>
        <h3 className="text-xl font-bold">Key Accomplishments</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {accomplishments.map((item, index) => (
          <motion.div
            key={item.id}
            className={`glass-card border border-white/10 rounded-xl bg-gradient-to-br ${item.color} p-6 flex flex-col items-center justify-center text-center`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={isInView 
              ? { opacity: 1, scale: 1, y: 0, transition: { delay: 0.1 * index, duration: 0.5 } } 
              : { opacity: 0, scale: 0.9, y: 20 }
            }
          >
            <div className="text-white mb-2">
              {getIconByName(item.icon_name)}
            </div>
            <h4 className="text-2xl font-bold text-white mb-1">{item.value}</h4>
            <p className="text-white/80 text-sm">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccomplishmentsDisplay;
