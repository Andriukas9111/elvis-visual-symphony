
import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface AboutHeaderProps {
  title?: string;
  subtitle?: string;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({ title, subtitle }) => {
  // Fetch about content from database if title/subtitle not provided as props
  const { data: content } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('title, subtitle')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !title || !subtitle
  });

  const displayTitle = title || content?.title || 'About Elvis Creative';
  const displaySubtitle = subtitle || content?.subtitle || 'Professional videographer and cinematographer with over 8 years of experience creating visual stories that captivate and inspire audiences worldwide.';

  return (
    <section className="py-16 bg-black">
      <div className="container max-w-4xl mx-auto px-4 text-center relative">
        {/* Purple decoration dots */}
        <div className="absolute top-0 right-20 w-2 h-2 bg-elvis-pink rounded-full" />
        <div className="absolute top-1/2 left-10 w-3 h-3 bg-elvis-pink rounded-full opacity-70" />
        <div className="absolute bottom-0 right-40 w-2 h-2 bg-elvis-pink rounded-full opacity-50" />

        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-white">About</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-elvis-pink italic">
            Elvis Creative
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {displaySubtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default AboutHeader;
