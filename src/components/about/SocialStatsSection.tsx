
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';
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

  if (isLoading) {
    return (
      <section className="py-12 bg-elvis-dark">
        <div className="container mx-auto px-4">
          <SectionHeading title="Social Statistics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-elvis-medium/50 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

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

  return (
    <section className="py-12 bg-elvis-dark">
      <div className="container mx-auto px-4">
        <SectionHeading title="Social Statistics" />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {displayStats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="flex flex-col items-center justify-center text-center p-6 rounded-xl h-36 transform transition-all duration-300 hover:scale-105 hover:shadow-pink-glow"
              style={{ 
                backgroundColor: stat.background_color || '#1A1A1A',
                color: stat.text_color || '#FFFFFF'
              }}
            >
              <div className="text-4xl mb-3">
                <IconRenderer iconName={stat.icon} />
              </div>
              <div className="text-2xl font-bold">
                {stat.value}
              </div>
              <div className="mt-2 text-sm">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialStatsSection;
