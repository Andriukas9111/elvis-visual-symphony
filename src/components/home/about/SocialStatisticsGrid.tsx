
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Play, Users, Camera, HeartPulse, Share2 } from 'lucide-react';
import { useStats } from '@/hooks/api/useStats';
import { StatItem } from '@/hooks/api/useStats';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialStatisticsGridProps {
  isInView: boolean;
}

// Function to format numbers (e.g., 1000000 to 1M)
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

const SocialStatisticsGrid: React.FC<SocialStatisticsGridProps> = ({ isInView }) => {
  const { data: stats, isLoading } = useStats();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Transform stats from database to include social platform information
  const socialStats = React.useMemo(() => {
    if (!stats || !stats.length) return [];

    // Map the database stats to include platform information
    return stats.map(stat => {
      let platform = '';
      let icon;
      let bgClass = '';
      let pulseColor = '';

      // Determine platform based on icon name
      switch (stat.icon_name) {
        case 'Instagram':
          platform = 'Instagram';
          icon = <Instagram size={32} strokeWidth={1.5} className="text-white" />;
          bgClass = 'from-purple-500 to-pink-600';
          pulseColor = 'rgba(219, 39, 119, 0.5)'; // pink-600
          break;
        case 'Youtube':
          platform = 'YouTube';
          icon = <Youtube size={32} strokeWidth={1.5} className="text-white" />;
          bgClass = 'from-red-600 to-red-700';
          pulseColor = 'rgba(185, 28, 28, 0.5)'; // red-700
          break;
        case 'TikTok':
          platform = 'TikTok';
          icon = <Share2 size={32} strokeWidth={1.5} className="text-white" />; // Using Share2 as a replacement
          bgClass = 'from-black to-gray-900';
          pulseColor = 'rgba(17, 24, 39, 0.5)'; // gray-900
          break;
        case 'Users':
          platform = 'Followers';
          icon = <Users size={32} strokeWidth={1.5} className="text-white" />;
          bgClass = 'from-blue-500 to-blue-600';
          pulseColor = 'rgba(37, 99, 235, 0.5)'; // blue-600
          break;
        case 'Camera':
          platform = 'Projects';
          icon = <Camera size={32} strokeWidth={1.5} className="text-white" />;
          bgClass = 'from-elvis-pink to-elvis-purple';
          pulseColor = 'rgba(236, 72, 153, 0.5)'; // pink
          break;
        case 'Play':
          platform = 'Views';
          icon = <Play size={32} strokeWidth={1.5} className="text-white" />;
          bgClass = 'from-green-500 to-green-600';
          pulseColor = 'rgba(22, 163, 74, 0.5)'; // green-600
          break;
        case 'Heart':
        case 'HeartPulse':
          platform = 'Likes';
          icon = <HeartPulse size={32} strokeWidth={1.5} className="text-white" />;
          bgClass = 'from-red-500 to-red-600';
          pulseColor = 'rgba(220, 38, 38, 0.5)'; // red-600
          break;
        default:
          platform = stat.label;
          icon = <Camera size={32} strokeWidth={1.5} className="text-white" />;
          bgClass = 'from-elvis-pink to-elvis-purple';
          pulseColor = 'rgba(236, 72, 153, 0.5)'; // pink
      }

      return {
        ...stat,
        platform,
        icon,
        bgClass,
        pulseColor
      };
    });
  }, [stats]);

  const StatCounter = ({ stat, index }: { stat: StatItem & { platform: string, icon: React.ReactNode, bgClass: string, pulseColor: string }, index: number }) => {
    const [count, setCount] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
      if (isInView && isClient) {
        setShouldAnimate(true);
      } else {
        setShouldAnimate(false);
        setCount(0);
      }
    }, [isInView, isClient]);

    useEffect(() => {
      if (!shouldAnimate) return;
      
      let startTime: number;
      let animationFrameId: number;
      const duration = 2000 + (index * 100); // Staggered durations
      
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        
        setCount(Math.floor(easedProgress * (stat.value as number)));
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateCount);
        }
      };
      
      animationFrameId = requestAnimationFrame(animateCount);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }, [shouldAnimate, stat.value, index]);

    const displayValue = formatNumber(count);
    const exactValue = new Intl.NumberFormat().format(stat.value as number);

    // Pulse animation style
    const pulseStyle = {
      boxShadow: `0 0 0 0 ${stat.pulseColor}`,
      animation: 'pulse 2s infinite'
    };

    return (
      <motion.div
        className="relative overflow-hidden rounded-xl"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5, delay: 0.1 * index }}
        whileHover={{ 
          scale: 1.03, 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className={`bg-gradient-to-br ${stat.bgClass} p-5 h-full flex items-center justify-between`}>
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-white/10 mr-4">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-white/90 text-sm">{stat.platform}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-white text-2xl font-bold">
                      {displayValue}{stat.suffix}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="bg-elvis-dark border-elvis-pink/20 text-white">
                    <p>{exactValue}{stat.suffix}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Pulse indicator */}
          <div className="h-3 w-3 rounded-full bg-white/20 relative">
            <div className="absolute w-3 h-3 rounded-full bg-white animate-ping opacity-75"></div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading || !isClient) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-elvis-light/10 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-8">
        <span className="h-8 w-1.5 bg-elvis-pink rounded-full mr-3"></span>
        <h2 className="text-3xl font-bold text-white">Social Statistics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialStats.map((stat, index) => (
          <StatCounter key={stat.id} stat={stat} index={index} />
        ))}
      </div>
      
      {/* Adding the CSS animation using standard style element */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
            }
            
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
            
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            }
          }
        `}
      </style>
    </>
  );
};

export default SocialStatisticsGrid;
