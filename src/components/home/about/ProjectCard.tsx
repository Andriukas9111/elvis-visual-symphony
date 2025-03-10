
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ProjectData } from './types';

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      } 
    }
  };

  return (
    <motion.div
      variants={variants}
      className="glass-card p-6 rounded-xl border border-white/10 hover:border-elvis-pink/30 transition-all group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 bg-elvis-medium/80 w-14 h-14 rounded-full flex items-center justify-center shadow-pink-glow">
          <div className="text-elvis-pink">
            {project.icon}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-white/70 text-sm">{project.description}</p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
