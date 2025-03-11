
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Clock, Award, Heart } from 'lucide-react';
import { useStats } from '@/hooks/api/useStats';

interface KeyAccomplishmentsProps {
  isInView: boolean;
}

const KeyAccomplishments: React.FC<KeyAccomplishmentsProps> = ({ isInView }) => {
  const { data: stats, isLoading } = useStats();

  // Filter accomplishment stats - we'll use the ones not shown in Social Statistics
  const accomplishmentStats = stats?.filter(
    stat => !['Camera', 'Video', 'Users', 'Eye'].includes(stat.icon_name)
  ) || [];

  // Default stats in case database is empty
  const defaultStats = [
    { id: '1', icon_name: 'Camera', value: 300, suffix: '+', label: 'Projects Completed' },
    { id: '2', icon_name: 'Video', value: 5, suffix: 'M+', label: 'Video Views' },
    { id: '3', icon_name: 'Clock', value: 8, suffix: '+', label: 'Years Experience' },
    { id: '4', icon_name: 'Award', value: 20, suffix: '+', label: 'Awards Won' },
    { id: '5', icon_name: 'Heart', value: 96, suffix: '%', label: 'Client Satisfaction' }
  ];

  // Use stats from the database or fallback to defaults
  const displayStats = accomplishmentStats.length > 0 ? accomplishmentStats : defaultStats;

  // Get the appropriate icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera size={24} className="text-white" />;
      case 'Video':
        return <Video size={24} className="text-white" />;
      case 'Clock':
        return <Clock size={24} className="text-white" />;
      case 'Award':
        return <Award size={24} className="text-white" />;
      case 'Heart':
        return <Heart size={24} className="text-white" />;
      default:
        return <Award size={24} className="text-white" />;
    }
  };

  // Colors for the cards
  const bgColors = [
    'from-purple-900 to-purple-800',
    'from-blue-900 to-blue-800',
    'from-green-900 to-green-800',
    'from-amber-900 to-amber-800',
    'from-rose-900 to-rose-800'
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
        Key Accomplishments
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayStats.slice(0, 5).map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${bgColors[index % bgColors.length]} rounded-xl p-5 flex flex-col items-center text-center`}
          >
            <div className="bg-black/20 p-3 rounded-full mb-3">
              {getIcon(stat.icon_name)}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stat.value}{stat.suffix}
            </h3>
            <p className="text-white/80 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default KeyAccomplishments;
