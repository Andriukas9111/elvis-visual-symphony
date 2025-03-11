
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';
import * as LucideIcons from 'lucide-react';

interface Accomplishment {
  id: string;
  title: string;
  value: string;
  suffix?: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

const AccomplishmentsSection: React.FC = () => {
  const { data: accomplishments, isLoading } = useQuery({
    queryKey: ['accomplishments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accomplishments')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as Accomplishment[];
    }
  });

  // Animation variants
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

  if (isLoading) {
    return (
      <section className="py-16 bg-elvis-dark">
        <div className="container mx-auto px-4">
          <SectionHeading title="Key Accomplishments" />
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
        <SectionHeading title="Key Accomplishments" />
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {accomplishments?.map((item) => (
            <motion.div
              key={item.id}
              className="flex flex-col items-center justify-center p-6 rounded-xl text-center h-48"
              style={{ backgroundColor: item.background_color, color: item.text_color }}
              variants={itemVariants}
            >
              <div className="text-4xl mb-3">
                {renderIcon(item.icon)}
              </div>
              <div className="text-3xl font-bold">
                {item.value}{item.suffix && <span>{item.suffix}</span>}
              </div>
              <div className="mt-2 text-sm">{item.title}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AccomplishmentsSection;
