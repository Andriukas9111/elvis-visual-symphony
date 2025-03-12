
import React from 'react';
import { motion } from 'framer-motion';
import { ExpertiseItem, containerVariants, itemVariants } from './types';
import IconRenderer from './IconRenderer';

interface ExpertiseTabContentProps {
  expertiseItems?: ExpertiseItem[];
  isLoading: boolean;
}

const ExpertiseTabContent: React.FC<ExpertiseTabContentProps> = ({ expertiseItems, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 rounded-xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {expertiseItems?.map((item) => (
        <motion.div
          key={item.id}
          className="bg-[#151515] rounded-xl p-6 hover:bg-gray-900 border border-purple-500/20 transition-colors"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-900 flex items-center justify-center mr-4">
              <IconRenderer iconName={item.icon} size={24} />
            </div>
            <h3 className="font-bold text-white text-lg">{item.title}</h3>
          </div>
          <p className="text-white/70">{item.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ExpertiseTabContent;
