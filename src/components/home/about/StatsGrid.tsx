
import React from 'react';
import StatCounter from './StatCounter';
import { useStats } from '@/hooks/api/useStats';
import { getAllIcons } from '@/components/admin/about/stats/IconSelector';

interface StatsGridProps {
  isInView: boolean;
}

const StatsGrid = ({ isInView }: StatsGridProps) => {
  const { data: statsData, isLoading, error } = useStats();
  
  // Get all icons with proper styling for the front-end display
  const getIconComponent = (iconName: string) => {
    const icons = getAllIcons();
    // Apply styling to the icon - we need to clone the element to add the classes
    const baseIcon = icons[iconName];
    if (!baseIcon) return null;
    
    // Clone the icon element and add the necessary classes
    return React.cloneElement(baseIcon as React.ReactElement, {
      className: "h-7 w-7 text-elvis-pink",
      strokeWidth: 1.5
    });
  };
  
  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl border border-white/10 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-elvis-pink/20 rounded-full"></div>
              <div className="h-6 w-20 bg-white/10 rounded"></div>
              <div className="h-4 w-24 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    console.error("Error loading stats:", error);
    return null;
  }

  // Map the data to include the icon component
  const mappedStats = statsData.map(stat => ({
    id: stat.id,
    icon: getIconComponent(stat.icon_name),
    value: stat.value,
    suffix: stat.suffix || '',
    label: stat.label,
    abbreviate: true // Default to abbreviate numbers
  }));

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mappedStats.map((stat, index) => (
          <StatCounter 
            key={stat.id}
            stat={stat}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
