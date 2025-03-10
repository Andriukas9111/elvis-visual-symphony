
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ProjectData } from './types';

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card p-6 rounded-xl border border-white/5 hover:border-elvis-pink/30 transition-all h-full flex flex-col"
    >
      <div className="mb-4 bg-elvis-medium/80 w-16 h-16 rounded-full flex items-center justify-center shadow-pink-glow">
        <div className="text-elvis-pink">
          {project.icon}
        </div>
      </div>
      <h3 className="font-bold text-xl mb-2">{project.title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{project.description}</p>
    </motion.div>
  );
};

export default ProjectCard;
