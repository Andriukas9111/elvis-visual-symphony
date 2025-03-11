
import React from 'react';
import { useStats } from '@/hooks/api/useStats';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { StatCard } from './StatCard';

const SocialStatistics = () => {
  const { data: stats, isLoading } = useStats();
  const [ref, inView] = useInView({ 
    triggerOnce: true,
    threshold: 0.1
  });

  if (isLoading) return null;

  return (
    <div className="container mx-auto px-4" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Social Statistics</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A snapshot of my online presence and audience engagement
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard stat={stat} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SocialStatistics;
