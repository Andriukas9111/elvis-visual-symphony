
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Award, Film, Users, Heart, BarChart } from 'lucide-react';
import { useStats } from '@/hooks/api/useStats';
import { useNavigate } from 'react-router-dom';

interface KeyAccomplishmentsProps {
  isInView: boolean;
}

const KeyAccomplishments: React.FC<KeyAccomplishmentsProps> = ({ isInView }) => {
  const { data: stats, isLoading } = useStats();
  const navigate = useNavigate();

  // Get icon based on name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera':
        return <Camera className="w-8 h-8 text-white" />;
      case 'Award':
        return <Award className="w-8 h-8 text-white" />;
      case 'Film':
        return <Film className="w-8 h-8 text-white" />;
      case 'Users':
        return <Users className="w-8 h-8 text-white" />;
      case 'Heart':
        return <Heart className="w-8 h-8 text-white" />;
      case 'BarChart':
        return <BarChart className="w-8 h-8 text-white" />;
      default:
        return <Award className="w-8 h-8 text-white" />;
    }
  };

  // Colors for cards
  const cardColors = [
    'from-purple-800 to-purple-900',
    'from-blue-900 to-indigo-900',
    'from-green-900 to-teal-900',
    'from-amber-800 to-yellow-900',
    'from-indigo-900 to-purple-900'
  ];

  const handleHireMeClick = () => {
    // Scroll to contact section
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="flex items-center mb-8">
          <div className="w-1 h-6 bg-purple-500 mr-3"></div>
          <h2 className="text-2xl font-bold text-white">Key Accomplishments</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 rounded-lg bg-elvis-light/20"></div>
          ))}
        </div>
      </div>
    );
  }

  // Use fetched stats or fallback
  const displayStats = stats && stats.length > 0 ? stats : [
    { id: '1', value: 300, label: 'Projects Completed', icon_name: 'Camera', suffix: '+', sort_order: 1 },
    { id: '2', value: 5, label: 'Video Views', icon_name: 'Film', suffix: 'M+', sort_order: 2 },
    { id: '3', value: 8, label: 'Years Experience', icon_name: 'BarChart', suffix: '+', sort_order: 3 },
    { id: '4', value: 20, label: 'Awards Won', icon_name: 'Award', suffix: '+', sort_order: 4 },
    { id: '5', value: 96, label: 'Client Satisfaction', icon_name: 'Heart', suffix: '%', sort_order: 5 }
  ];

  // Sort by sort order
  const sortedStats = [...displayStats].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="mt-12">
      <div className="flex items-center mb-8">
        <div className="w-1 h-6 bg-purple-500 mr-3"></div>
        <h2 className="text-2xl font-bold text-white">Key Accomplishments</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {sortedStats.slice(0, 5).map((stat, index) => (
          <motion.div
            key={stat.id}
            className={`bg-gradient-to-br ${cardColors[index % cardColors.length]} rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <div className="mb-2">
              {getIcon(stat.icon_name)}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stat.value}{stat.suffix || ''}
            </h3>
            <p className="text-white/80 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <motion.button
          onClick={handleHireMeClick}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Hire Me
        </motion.button>
      </div>
    </div>
  );
};

export default KeyAccomplishments;
