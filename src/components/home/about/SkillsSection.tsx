
import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TechnicalSkillCard from './TechnicalSkillCard';
import { TechnicalSkillData } from './types';
import { supabase } from '@/lib/supabase';

const SkillsSection = () => {
  const [skills, setSkills] = useState<TechnicalSkillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('technical_skills')
          .select('*')
          .order('category', { ascending: true });
          
        if (error) throw error;
        
        setSkills(data as TechnicalSkillData[]);
      } catch (err) {
        console.error('Error fetching technical skills:', err);
        setError('Failed to load technical skills');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSkills();
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-8" ref={ref}>
      <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {skills.map((category) => (
          <TechnicalSkillCard key={category.id} category={category} />
        ))}
      </motion.div>
    </div>
  );
};

export default SkillsSection;
