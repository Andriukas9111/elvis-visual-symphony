
import React from 'react';
import { motion } from 'framer-motion';
import { useStatistics } from '@/hooks/api/useStatistics';
import StatCard from '@/components/ui/about/StatCard';
import SectionHeading from '@/components/ui/about/SectionHeading';
import { staggerContainer } from '@/types/about.types';

const KeyAccomplishments: React.FC = () => {
  const { data: statistics = [], isLoading } = useStatistics('accomplishment');

  // Default stats in case database is empty
  const defaultStats = [
    { 
      id: '1', 
      icon_name: 'CheckCircle', 
      value: 300, 
      suffix: '+', 
      label: 'Projects Completed', 
      category: 'accomplishment',
      sort_order: 0,
      created_at: '',
      updated_at: ''
    },
    { 
      id: '2', 
      icon_name: 'Calendar', 
      value: 8, 
      suffix: '+', 
      label: 'Years Experience', 
      category: 'accomplishment',
      sort_order: 1,
      created_at: '',
      updated_at: ''
    },
    { 
      id: '3', 
      icon_name: 'Trophy', 
      value: 20, 
      suffix: '+', 
      label: 'Awards Won', 
      category: 'accomplishment',
      sort_order: 2,
      created_at: '',
      updated_at: ''
    },
    { 
      id: '4', 
      icon_name: 'Star', 
      value: 96, 
      suffix: '%', 
      label: 'Client Satisfaction', 
      category: 'accomplishment',
      sort_order: 3,
      created_at: '',
      updated_at: ''
    },
    { 
      id: '5', 
      icon_name: 'Globe', 
      value: 25, 
      suffix: '+', 
      label: 'Countries Filmed', 
      category: 'accomplishment',
      sort_order: 4,
      created_at: '',
      updated_at: ''
    }
  ];

  // Use stats from the database or fallback to defaults
  const displayStats = statistics.length > 0 ? statistics : defaultStats;
  
  if (isLoading) {
    return (
      <div>
        <div className="bg-elvis-medium/20 h-10 w-48 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-elvis-medium/20 rounded-xl h-36"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading 
        title="Key Accomplishments" 
        accent="purple"
      />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {displayStats.slice(0, 5).map((stat, index) => (
          <StatCard 
            key={stat.id} 
            stat={stat} 
            index={index}
            variant="accent"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default KeyAccomplishments;
