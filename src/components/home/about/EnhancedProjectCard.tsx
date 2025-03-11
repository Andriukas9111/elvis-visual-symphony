
import React from 'react';
import { motion } from 'framer-motion';
import { ExpertiseItem } from '@/hooks/api/useExpertise';

interface EnhancedProjectCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  project?: ExpertiseItem;
  delay?: number;
}

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({ 
  title, 
  description, 
  icon,
  project,
  delay = 0
}) => {
  // Use props from project if provided
  const displayTitle = project?.label || title;
  const displayDescription = project?.description || description;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark p-6 rounded-xl border border-elvis-medium/30 shadow-md"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="bg-elvis-purple/10 p-3 rounded-full">
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

export default EnhancedProjectCard;
