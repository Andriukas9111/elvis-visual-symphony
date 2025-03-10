
import React from 'react';
import { motion } from 'framer-motion';
import { ExpertiseItem } from '@/hooks/api/useExpertise';
import { getAllIcons } from '@/components/admin/about/stats/IconSelector';

interface EnhancedProjectCardProps {
  project: ExpertiseItem;
  delay?: number;
}

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({ 
  project, 
  delay = 0 
}) => {
  const allIcons = getAllIcons();
  const icon = allIcons[project.icon_name] || allIcons['Film'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 10px 25px -5px rgba(176, 38, 255, 0.2)' 
      }}
      className="bg-gradient-to-br from-elvis-dark/80 to-elvis-light/40 rounded-xl border-2 border-elvis-purple/10 overflow-hidden"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="rounded-xl bg-gradient-to-br from-elvis-purple/20 to-elvis-pink/20 p-4 border border-elvis-purple/30">
            <div className="text-elvis-purple w-8 h-8 flex items-center justify-center">
              {React.cloneElement(icon as React.ReactElement, { size: 28, strokeWidth: 1.5 })}
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-1">
              {project.label}
            </h4>
            <div className="h-px w-16 bg-gradient-to-r from-elvis-purple to-elvis-pink mb-3"></div>
          </div>
        </div>
        
        <p className="text-white/80 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
};

export default EnhancedProjectCard;
