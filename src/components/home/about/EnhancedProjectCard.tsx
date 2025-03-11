
import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedProjectCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({ title, description, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-elvis-darker to-elvis-dark p-6 rounded-xl border border-elvis-medium/30 shadow-md"
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="bg-elvis-purple/10 p-3 rounded-full">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/70">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedProjectCard;
