
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

  // Function to render icons from Lucide or use a fallback to class-based icons
  const renderIcon = (iconName: string) => {
    // Check if it's a Lucide icon (starts with "lucide-")
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
  
  return (
    <section className="py-16 bg-elvis-dark">
      <div className="container mx-auto px-4">
        <SectionHeading title="Social Statistics" />
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
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
                  {renderIcon(stat.icon)}
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
      </div>
    </section>
  );
};

export default SocialStatsSection;
