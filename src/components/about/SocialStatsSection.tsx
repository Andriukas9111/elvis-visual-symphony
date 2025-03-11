
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';
import * as LucideIcons from 'lucide-react';

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

  // Function to render icons from Lucide
  const renderIcon = (iconName: string) => {
    if (iconName.startsWith('lucide-')) {
      const iconKey = iconName.replace('lucide-', '');
      // Convert kebab-case to PascalCase for Lucide icons
      const pascalCaseIcon = iconKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      
      const Icon = (LucideIcons as any)[pascalCaseIcon];
      
      if (Icon) {
        return <Icon size={32} />;
      }
    }
    
    // Fallback to class-based icon (for Font Awesome, etc.)
    return <i className={iconName}></i>;
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
      <section className="py-16 bg-elvis-dark">
        <div className="container mx-auto px-4">
          <SectionHeading title="Social Statistics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-48 bg-elvis-medium/50 rounded-xl animate-pulse" />
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
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
        >
          {stats?.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="flex flex-col items-center justify-center text-center p-6 rounded-xl h-48 transform transition-all duration-300 hover:scale-105 hover:shadow-pink-glow"
              style={{ 
                backgroundColor: stat.background_color || '#1A1A1A',
                color: stat.text_color || '#FFFFFF'
              }}
            >
              <div className="text-4xl mb-3">
                {renderIcon(stat.icon)}
              </div>
              <div className="text-3xl font-bold">
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
