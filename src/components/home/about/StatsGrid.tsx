
import React from 'react';
import { Camera, Video, Award, Users } from 'lucide-react';
import StatCounter from './StatCounter';

interface StatsGridProps {
  isInView: boolean;
}

const StatsGrid = ({ isInView }: StatsGridProps) => {
  // Stats data
  const statsData = [
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
  ];

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
