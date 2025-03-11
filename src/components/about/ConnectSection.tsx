
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  background_color: string;
  text_color: string;
  order_index: number;
}

const ConnectSection: React.FC = () => {
  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index');
        
      if (error) throw error;
      return data as SocialLink[];
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
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };
  
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="py-16">
      <SectionHeading title="Connect With Me" />
      
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-10 max-w-6xl mx-auto"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {isLoading ? (
          // Skeleton placeholders
          Array(6).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="h-28 rounded-lg bg-elvis-medium animate-pulse"
            />
          ))
        ) : (
          socialLinks?.map(link => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={item}
              className="rounded-lg p-4 flex flex-col items-center justify-center text-center h-28 hover:scale-105 transition-transform"
              style={{ 
                backgroundColor: link.background_color, 
                color: link.text_color || '#FFFFFF'
              }}
            >
              <div className="text-3xl mb-2">
                <i className={`${link.icon}`}></i>
              </div>
              <h3 className="text-sm font-medium">{link.platform}</h3>
            </motion.a>
          ))
        )}
      </motion.div>
      
      <div className="flex justify-center">
        <Button 
          variant="default" 
          size="lg" 
          className="bg-elvis-pink hover:bg-elvis-pink/90"
          onClick={scrollToContact}
        >
          Contact Me
        </Button>
      </div>
    </section>
  );
};

export default ConnectSection;
