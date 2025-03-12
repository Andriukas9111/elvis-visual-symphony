
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import IconRenderer from './expertise/IconRenderer';

interface SocialStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  background_color?: string;
  text_color?: string;
  order_index: number;
}

const SocialStatsSection: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['socialStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_stats')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as SocialStat[];
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Fallback data if no stats are available from database
  const fallbackStats = [
    {
      id: '1',
      title: 'Projects',
      value: '8+',
      icon: 'lucide-camera',
      background_color: '#FF66FF',
      text_color: '#FFFFFF',
      order_index: 1
    },
    {
      id: '2',
      title: 'Projects filmed & edited',
      value: '100+',
      icon: 'lucide-camera',
      background_color: '#FF66FF',
      text_color: '#FFFFFF',
      order_index: 2
    },
    {
      id: '3',
      title: 'Followers',
      value: '37K+',
      icon: 'lucide-users',
      background_color: '#3B82F6',
      text_color: '#FFFFFF',
      order_index: 3
    },
    {
      id: '4',
      title: 'Views across social media',
      value: '10M+',
      icon: 'lucide-camera',
      background_color: '#FF66FF',
      text_color: '#FFFFFF',
      order_index: 4
    }
  ];

  const displayStats = stats && stats.length > 0 ? stats : fallbackStats;

  if (isLoading) {
    return (
      <section className="py-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="relative">
            <h2 className="text-2xl font-semibold mb-8 flex items-center">
              <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
              Social Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-800 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4">
        <div className="relative">
          <h2 className="text-2xl font-semibold mb-8 flex items-center">
            <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
            Social Statistics
          </h2>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {displayStats.map((stat) => (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                className="flex flex-col items-center justify-center text-center p-6 rounded-xl hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: stat.background_color || '#BC5BD8',
                  color: stat.text_color || '#FFFFFF'
                }}
              >
                <div className="mb-2">
                  <IconRenderer iconName={stat.icon} size={24} />
                </div>
                <div className="text-xl font-bold">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm opacity-90">
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SocialStatsSection;
