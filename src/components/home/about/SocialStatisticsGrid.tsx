
import React from 'react';
import { motion } from 'framer-motion';
import { SocialPlatformData, StatData } from './types';
import { StatItem } from '@/hooks/api/useStats';
import * as Icons from 'lucide-react';

const SocialStatisticsGrid = ({ socialPlatforms }: { socialPlatforms: SocialPlatformData[] }) => {
  // Create a function to render icon by name
  const renderIconByName = (iconName?: string) => {
    if (!iconName) return null;
    
    const IconComponent = Icons[iconName as keyof typeof Icons];
    if (typeof IconComponent === 'function') {
      return <IconComponent size={24} />;
    }
    return null;
  };

  // Transform social platforms to stat items
  const socialStats: (StatItem & { platform: string; icon: React.ReactNode; bgClass: string; pulseColor: string })[] = 
    socialPlatforms.map((platform) => {
      // Define platform-specific styling
      let bgClass = 'bg-elvis-darker';
      let pulseColor = 'bg-elvis-pink/20';
      
      // Set specific colors based on platform name
      switch (platform.platform.toLowerCase()) {
        case 'instagram':
          bgClass = 'bg-gradient-to-br from-purple-600 to-pink-500';
          pulseColor = 'bg-pink-500/30';
          break;
        case 'youtube':
          bgClass = 'bg-gradient-to-br from-red-600 to-red-700';
          pulseColor = 'bg-red-500/30';
          break;
        case 'twitter':
        case 'x':
          bgClass = 'bg-gradient-to-br from-blue-400 to-blue-600';
          pulseColor = 'bg-blue-500/30';
          break;
        case 'facebook':
          bgClass = 'bg-gradient-to-br from-blue-600 to-blue-800';
          pulseColor = 'bg-blue-600/30';
          break;
        case 'linkedin':
          bgClass = 'bg-gradient-to-br from-blue-500 to-blue-700';
          pulseColor = 'bg-blue-600/30';
          break;
        case 'tiktok':
          bgClass = 'bg-gradient-to-br from-black to-pink-500';
          pulseColor = 'bg-pink-500/30';
          break;
        default:
          if (platform.color) {
            bgClass = `bg-[${platform.color}]`;
            pulseColor = `bg-[${platform.color}]/30`;
          }
      }
      
      // Create stat item from platform data
      return {
        platform: platform.platform,
        id: platform.id,
        title: platform.platform,
        icon: renderIconByName(platform.icon_name) || null,
        value: platform.followers || 0,
        suffix: ' followers',
        bgClass,
        pulseColor,
        label: platform.name || platform.platform // Required by StatItem interface
      } as StatItem & { platform: string; icon: React.ReactNode; bgClass: string; pulseColor: string };
    });

  // Variant for animated container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Variants for individual stat cards
  const statVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {socialStats.map((stat) => (
        <motion.div
          key={stat.id}
          className={`rounded-xl p-4 ${stat.bgClass} shadow-lg relative overflow-hidden`}
          variants={statVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          {/* Pulse effect in background */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-20 animate-pulse-slow">
            <div className={`w-full h-full rounded-full ${stat.pulseColor}`}></div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-lg font-semibold">{stat.title}</h3>
            <div className="text-white/80">
              {stat.icon}
            </div>
          </div>
          
          <div className="text-3xl font-bold text-white">
            {typeof stat.value === 'number' && stat.value >= 1000 
              ? `${(stat.value / 1000).toFixed(1)}K` 
              : stat.value}
            <span className="text-white/70 text-sm ml-1">{stat.suffix}</span>
          </div>
          
          {stat.label && (
            <div className="text-sm text-white/60 mt-1">{stat.label}</div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SocialStatisticsGrid;
