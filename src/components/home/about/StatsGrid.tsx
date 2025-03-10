
import React, { useState, useEffect } from 'react';
import { Camera, Video, Award, Users } from 'lucide-react';
import StatCounter from './StatCounter';
import { useContent } from '@/hooks/api/useContent';

interface StatsGridProps {
  isInView: boolean;
}

// Helper function to get the right icon component
const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    Camera: <Camera className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />,
    Video: <Video className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />,
    Award: <Award className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />,
    Users: <Users className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />
  };
  return icons[iconName] || <Camera className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />;
};

const StatsGrid = ({ isInView }: StatsGridProps) => {
  const { data: contentData, isLoading } = useContent('about');
  const [statsData, setStatsData] = useState([
    { 
      id: 1, 
      icon: <Camera className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
      value: 350, 
      suffix: '+', 
      label: 'Photo Projects' 
    },
    { 
      id: 2, 
      icon: <Video className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
      value: 120, 
      suffix: '+',  
      label: 'Video Productions' 
    },
    { 
      id: 3, 
      icon: <Award className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
      value: 28, 
      suffix: '',  
      label: 'Industry Awards' 
    },
    { 
      id: 4, 
      icon: <Users className="h-7 w-7 text-elvis-pink" strokeWidth={1.5} />, 
      value: 45, 
      suffix: '+',  
      label: 'Happy Clients' 
    }
  ]);

  useEffect(() => {
    if (contentData) {
      const statsContent = contentData.find(item => item.section === 'about' && item.media_url === 'stats');
      
      if (statsContent?.content) {
        try {
          const parsedStats = JSON.parse(statsContent.content);
          
          // Map the data to include the icon component
          const mappedStats = parsedStats.map((stat: any) => ({
            ...stat,
            icon: getIconComponent(stat.iconName || 'Camera')
          }));
          
          setStatsData(mappedStats);
        } catch (error) {
          console.error('Error parsing stats data:', error);
        }
      }
    }
  }, [contentData]);

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/20 transition-all">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
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
