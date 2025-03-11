
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/about/SectionHeading';
import StatCard from '@/components/ui/about/StatCard';
import { staggerContainer, fadeInUpVariant, AccentColor } from '@/types/about.types';

const SocialStatistics: React.FC = () => {
  // Sample statistics data (would come from the database in a real implementation)
  const statistics = [
    {
      id: '1',
      icon: 'Play',
      title: 'Videos Created',
      value: 500,
      suffix: '+',
      color: 'pink' as AccentColor
    },
    {
      id: '2',
      icon: 'Users',
      title: 'Happy Clients',
      value: 150,
      suffix: '+',
      color: 'purple' as AccentColor
    },
    {
      id: '3',
      icon: 'Calendar',
      title: 'Years Experience',
      value: 10,
      suffix: '+',
      color: 'blue' as AccentColor
    },
    {
      id: '4',
      icon: 'Award',
      title: 'Awards Won',
      value: 25,
      suffix: '',
      color: 'teal' as AccentColor
    }
  ];
  
  return (
    <div className="space-y-6">
      <SectionHeading 
        title="By The Numbers" 
        subtitle="Statistics and achievements throughout my career"
        centered={true}
        accent="purple"
      />
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statistics.map((stat, index) => (
          <StatCard
            key={stat.id}
            id={stat.id}
            icon={<React.Fragment>{stat.icon}</React.Fragment>}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.title}
            abbreviate={false}
            index={index}
            color={stat.color}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default SocialStatistics;
