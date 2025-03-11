
import React from 'react';
import { motion } from 'framer-motion';
import { ExpertiseItem } from '@/hooks/api/useExpertise';

interface EnhancedExpertiseCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  expertise?: ExpertiseItem;
  delay?: number;
}

const EnhancedExpertiseCard: React.FC<EnhancedExpertiseCardProps> = ({ 
  title, 
  description, 
  icon,
  expertise,
  delay = 0 
}) => {
  // Use props from expertise if provided
  const displayTitle = expertise?.label || title;
  const displayDescription = expertise?.description || description;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark p-6 rounded-xl border border-elvis-medium/30 shadow-md"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="bg-elvis-pink/10 p-3 rounded-full">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{displayTitle}</h3>
          <p className="text-white/70">{displayDescription}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedExpertiseCard;
