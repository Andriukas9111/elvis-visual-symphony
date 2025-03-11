
import React from 'react';
import { motion } from 'framer-motion';
import { ProjectType, containerVariants, itemVariants } from './types';
import IconRenderer from './IconRenderer';

interface ProjectTypesTabContentProps {
  projectTypes?: ProjectType[];
  isLoading: boolean;
}

const ProjectTypesTabContent: React.FC<ProjectTypesTabContentProps> = ({ projectTypes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-elvis-medium rounded-xl h-64 animate-pulse" />
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
      {projectTypes?.map((item) => (
        <motion.div
          key={item.id}
          className="bg-elvis-medium rounded-xl p-6 hover:bg-elvis-light transition-colors hover:shadow-pink-glow"
          variants={itemVariants}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-elvis-pink flex items-center justify-center mr-4">
              <IconRenderer iconName={item.icon} />
            </div>
            <h3 className="font-bold text-xl">{item.title}</h3>
          </div>
          <p className="text-white/70">{item.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProjectTypesTabContent;
