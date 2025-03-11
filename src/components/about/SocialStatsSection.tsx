
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Camera, Users, Eye, PlayCircle } from 'lucide-react';

interface SocialStat {
  id: string;
  title: string;
  value: string;
  icon: string;
  background_color: string;
  text_color: string;
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

  const renderIcon = (iconName: string) => {
    const icons = {
      'camera': <Camera className="w-6 h-6" />,
      'users': <Users className="w-6 h-6" />,
      'eye': <Eye className="w-6 h-6" />,
      'play-circle': <PlayCircle className="w-6 h-6" />
    };
    
    return icons[iconName as keyof typeof icons] || null;
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-elvis-medium/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="relative">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span className="w-1 h-6 bg-elvis-pink rounded-full"></span>
        Social Statistics
      </h2>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats?.map((stat) => (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            className="relative group"
          >
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-elvis-medium to-elvis-dark p-6 hover:shadow-pink-glow transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {renderIcon(stat.icon)}
                  <div className="text-2xl font-bold mt-3">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.title}</div>
                </div>
                <div className="opacity-10 group-hover:opacity-20 transition-opacity">
                  {renderIcon(stat.icon)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SocialStatsSection;
