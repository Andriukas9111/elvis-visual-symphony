
import React from 'react';
import { motion } from 'framer-motion';
import { useExpertise } from '@/hooks/api/useExpertise';
import EnhancedExpertiseContainer from './EnhancedExpertiseContainer';
import DecoratedSectionHeader from './DecoratedSectionHeader';

interface ExpertiseTabProps {
  isInView: boolean;
}

const ExpertiseTab: React.FC<ExpertiseTabProps> = ({ isInView }) => {
  const { data: expertiseItems = [] } = useExpertise();
  
  // Filter items by type
  const expertiseData = expertiseItems.filter(item => item.type === 'expertise');
  
  // Sort by sort_order
  const sortedExpertise = [...expertiseData].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <motion.div
      className="w-full py-6"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <DecoratedSectionHeader title="Areas of Expertise" subtitle="Specialized skills & services" />
      
      <div className="mt-8">
        <EnhancedExpertiseContainer expertise={sortedExpertise} />
      </div>
    </motion.div>
  );
};

export default ExpertiseTab;
