
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { StatData } from './types';
import StatCounter from './StatCounter';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';
import { useStats } from '@/hooks/api/useStats';

const formatStatValue = (value: number, abbreviate: boolean = false): string => {
  if (!abbreviate) return value.toString();
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  
  return value.toString();
};

const StatsGrid: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const { data: statsData, isLoading } = useStats();
  
  // Default stats to show if no API data is available
  const defaultStats: StatData[] = [
    {
      id: "1",
      title: "Completed Projects",
      value: 150,
      icon_name: "CheckCircle",
      suffix: "+",
      label: "Projects"
    },
    {
      id: "2",
      title: "Client Satisfaction",
      value: 98,
      icon_name: "Heart",
      suffix: "%",
      label: "Satisfaction"
    },
    {
      id: "3",
      title: "Years Experience",
      value: 8,
      icon_name: "Calendar",
      suffix: "+",
      label: "Years"
    },
    {
      id: "4",
      title: "Awards Won",
      value: 25,
      icon_name: "Trophy",
      suffix: "",
      label: "Awards"
    }
  ];
  
  const stats = statsData && statsData.length > 0 ? statsData : defaultStats;
  
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div ref={ref} className="py-12">
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
      >
        {stats.map((stat) => {
          const icon = stat.icon_name ? getIconByName(stat.icon_name) : null;
          const formattedValue = formatStatValue(stat.value, true);
          const displayValue = `${stat.prefix || ''}${formattedValue}${stat.suffix || ''}`;
          
          return (
            <StatCounter
              key={stat.id}
              id={stat.id}
              icon={icon}
              value={displayValue}
              suffix={stat.suffix || ''}
              label={stat.label || stat.title}
              abbreviate={true}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default StatsGrid;
