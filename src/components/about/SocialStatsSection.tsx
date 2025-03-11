
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import * as LucideIcons from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const renderIcon = (iconName: string) => {
    if (iconName.startsWith('lucide-')) {
      const iconKey = iconName.replace('lucide-', '');
      const pascalCaseIcon = iconKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      const Icon = (LucideIcons as any)[pascalCaseIcon];
      
      if (Icon) {
        return <Icon size={32} />;
      }
    }
    return <i className={iconName}></i>;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-elvis-dark">
        <div className="container mx-auto px-4">
          <SectionHeading title="Social Statistics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-elvis-medium rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-elvis-dark">
      <div className="container mx-auto px-4">
        <SectionHeading title="Social Statistics" />
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats?.map((stat) => (
            <motion.div
              key={stat.id}
              className="flex flex-col items-center justify-center p-6 rounded-xl text-center h-48"
              style={{ backgroundColor: stat.background_color, color: stat.text_color }}
              variants={itemVariants}
            >
              <div className="text-4xl mb-3">
                {renderIcon(stat.icon)}
              </div>
              <div className="text-3xl font-bold">
                {stat.value}
              </div>
              <div className="mt-2 text-sm">{stat.title}</div>
              {stat.subtitle && <div className="mt-1 text-sm opacity-80">{stat.subtitle}</div>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialStatsSection;
