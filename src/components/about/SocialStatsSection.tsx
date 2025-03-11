
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface SocialStat {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
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
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <section className="py-16">
      <SectionHeading title="Social Statistics" />
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {isLoading ? (
          // Skeleton placeholders
          Array(4).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="h-48 rounded-lg bg-elvis-medium animate-pulse"
            />
          ))
        ) : (
          stats?.map(stat => (
            <motion.div
              key={stat.id}
              variants={item}
              className="rounded-lg p-6 flex flex-col justify-between h-48"
              style={{ 
                backgroundColor: stat.background_color || '#FF66FF',
                color: stat.text_color || '#FFFFFF'
              }}
            >
              <div className="text-4xl mb-2">
                {/* Render icon based on name */}
                <i className={`${stat.icon}`}></i>
              </div>
              <div>
                <p className="text-4xl font-bold">{stat.value}</p>
                <h3 className="text-xl mt-2">{stat.title}</h3>
                {stat.subtitle && <p className="text-sm opacity-80 mt-1">{stat.subtitle}</p>}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
};

export default SocialStatsSection;
