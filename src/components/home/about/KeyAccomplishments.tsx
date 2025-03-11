
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Clock, Award, Heart } from 'lucide-react';
import { useStats } from '@/hooks/api/useStats';
import { getIconByName } from '@/components/admin/about/stats/IconSelector';

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
    { id: '1', icon_name: 'Award', value: 20, suffix: '+', label: 'Awards Won' },
    { id: '2', icon_name: 'Clock', value: 8, suffix: '+', label: 'Years Experience' },
    { id: '3', icon_name: 'Heart', value: 96, suffix: '%', label: 'Client Satisfaction' },
    { id: '4', icon_name: 'Film', value: 500, suffix: '+', label: 'Projects Completed' },
    { id: '5', icon_name: 'Users', value: 150, suffix: '+', label: 'Happy Clients' }
  ];

  // Use stats from the database or fallback to defaults
  const displayStats = accomplishmentStats.length > 0 ? accomplishmentStats : defaultStats;

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
              {getIconByName(stat.icon_name, "text-white h-6 w-6")}
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
