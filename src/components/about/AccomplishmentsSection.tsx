
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import IconRenderer from './expertise/IconRenderer';

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

  // Fallback data if no accomplishments are available from database
  const fallbackAccomplishments = [
    {
      id: '1',
      title: 'Projects Completed',
      value: '300',
      suffix: '+',
      icon: 'lucide-check-circle',
      background_color: '#382A3F',
      text_color: '#FFFFFF',
      order_index: 1
    },
    {
      id: '2',
      title: 'Video Views',
      value: '5M',
      suffix: '+',
      icon: 'lucide-tv',
      background_color: '#1E253F',
      text_color: '#FFFFFF',
      order_index: 2
    },
    {
      id: '3',
      title: 'Years Experience',
      value: '8',
      suffix: '+',
      icon: 'lucide-calendar',
      background_color: '#1C362F',
      text_color: '#FFFFFF',
      order_index: 3
    },
    {
      id: '4',
      title: 'Awards Won',
      value: '20',
      suffix: '+',
      icon: 'lucide-trophy',
      background_color: '#4B3B1D',
      text_color: '#FFFFFF',
      order_index: 4
    },
    {
      id: '5',
      title: 'Client Satisfaction',
      value: '96',
      suffix: '%',
      icon: 'lucide-star',
      background_color: '#3A1E3F',
      text_color: '#FFFFFF',
      order_index: 5
    }
  ];

  const displayAccomplishments = accomplishments && accomplishments.length > 0 
    ? accomplishments 
    : fallbackAccomplishments;

  return (
    <section className="py-8 bg-black">
      <div className="container mx-auto px-4">
        <div className="relative">
          <h2 className="text-2xl font-semibold mb-8 flex items-center">
            <div className="w-1 h-6 bg-elvis-pink mr-3"></div>
            Key Accomplishments
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-gray-800 rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {displayAccomplishments.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col items-center justify-center p-6 rounded-xl text-center h-32"
                  style={{ backgroundColor: item.background_color, color: item.text_color }}
                  variants={itemVariants}
                >
                  <div className="text-3xl mb-2">
                    <IconRenderer iconName={item.icon} />
                  </div>
                  <div className="text-2xl font-bold">
                    {item.value}{item.suffix && <span>{item.suffix}</span>}
                  </div>
                  <div className="mt-1 text-sm opacity-90">{item.title}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AccomplishmentsSection;
