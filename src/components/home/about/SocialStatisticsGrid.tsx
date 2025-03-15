
import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnimation } from '@/contexts/AnimationContext';
import { StatItem } from '@/hooks/api/useStats';
import * as LucideIcons from 'lucide-react';

interface SocialStatisticsGridProps {
  stats: StatItem[];
  isLoading: boolean;
}

const SocialStatisticsGrid: React.FC<SocialStatisticsGridProps> = ({ stats, isLoading }) => {
  const { prefersReducedMotion } = useAnimation();

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Get icon component from icon name
  const getIconComponent = (iconName: string) => {
    try {
      if (!iconName) return null;
      
      const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
      const icons = LucideIcons as unknown as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>;
      
      const IconComponent = icons[formattedIconName];
      return IconComponent ? <IconComponent className="h-6 w-6 text-elvis-pink" /> : null;
    } catch (error) {
      console.error(`Error loading icon: ${iconName}`, error);
      return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-elvis-dark/50 border border-elvis-dark rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full bg-elvis-dark" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-elvis-dark" />
                <Skeleton className="h-3 w-16 bg-elvis-dark" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id || index}
          className="bg-elvis-dark/30 backdrop-blur-sm border border-elvis-dark/50 rounded-lg p-6 hover:border-elvis-pink/30 transition-all duration-300"
          variants={prefersReducedMotion ? undefined : itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-elvis-pink/20 h-12 w-12 rounded-full flex items-center justify-center">
              {stat.icon_name ? 
                getIconComponent(stat.icon_name) : 
                <span className="text-elvis-pink text-xl font-bold">
                  {stat.icon_name ? stat.icon_name.charAt(0).toUpperCase() : '#'}
                </span>
              }
            </div>
            <div>
              <div className="text-xl font-bold text-white">{stat.value}{stat.suffix || ''}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SocialStatisticsGrid;
