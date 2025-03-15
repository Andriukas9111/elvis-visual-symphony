
import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import SocialStatisticsGrid from './SocialStatisticsGrid';
import { useStats } from '@/hooks/api/useStats';
import { logError } from '@/utils/errorLogger';

interface SocialStatisticsProps {
  title?: string;
  subtitle?: string;
  tab?: string;
}

const SocialStatistics: React.FC<SocialStatisticsProps> = ({
  title = "Social Statistics",
  subtitle = "Stay updated with our latest performance metrics across platforms",
  tab = "social"
}) => {
  const { prefersReducedMotion } = useAnimation();
  
  // Use the tab-filtered stats query
  const { data: stats, isLoading, error } = useStats({ tab });

  if (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      context: 'SocialStatistics',
      level: 'error'
    });
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={prefersReducedMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
          {subtitle && <p className="text-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}

      <SocialStatisticsGrid stats={stats || []} isLoading={isLoading} />
    </motion.div>
  );
};

export default SocialStatistics;
