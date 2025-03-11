
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

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
      <SectionHeading title="Key Accomplishments" />
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {isLoading ? (
          // Skeleton placeholders
          Array(5).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="h-48 rounded-lg bg-elvis-medium animate-pulse"
            />
          ))
        ) : (
          accomplishments?.map(item => (
            <motion.div
              key={item.id}
              variants={item}
              className="rounded-lg p-6 flex flex-col items-center justify-center text-center h-48"
              style={{ 
                backgroundColor: item.background_color, 
                color: item.text_color || '#FFFFFF'
              }}
            >
              <div className="text-3xl mb-3">
                <i className={`${item.icon}`}></i>
              </div>
              <p className="text-3xl font-bold">
                {item.value}
                {item.suffix && <span className="text-sm ml-1">{item.suffix}</span>}
              </p>
              <h3 className="text-lg mt-2">{item.title}</h3>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
};

export default AccomplishmentsSection;
