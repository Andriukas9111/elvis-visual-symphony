
import React from 'react';
import { motion } from 'framer-motion';
import { Expertise } from '@/types/about.types';
import { fadeInUpVariant } from '@/types/about.types';
import { getDynamicIcon } from '@/utils/iconUtils';

interface ExpertiseCardProps {
  expertise: Expertise;
  index: number;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ expertise, index }) => {
  const Icon = getDynamicIcon(expertise.icon_name);
  
  return (
    <motion.div
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark/60 p-6 rounded-xl border border-elvis-medium/20 shadow-md h-full"
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={index}
      whileHover={{ 
        y: -5, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-start gap-4">
        <div className="bg-elvis-pink/10 p-3 rounded-full">
          <Icon className="h-6 w-6 text-elvis-pink" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{expertise.title}</h3>
          <p className="text-white/70">{expertise.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertiseCard;
