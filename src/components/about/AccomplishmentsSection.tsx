
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import SectionHeading from './SectionHeading';

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

  if (isLoading) {
    return (
      <section className="py-16">
        <SectionHeading title="Key Accomplishments" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-elvis-medium rounded-xl h-36 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
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
            className="flex flex-col items-center justify-center p-6 rounded-xl text-center h-full"
            style={{ backgroundColor: item.background_color, color: item.text_color }}
            variants={itemVariants}
          >
            <i className={`${item.icon} text-4xl mb-3`}></i>
            <div className="text-3xl font-bold">
              {item.value}{item.suffix && <span>{item.suffix}</span>}
            </div>
            <div className="mt-2 text-sm">{item.title}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AccomplishmentsSection;
