
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const projectTypes = [
  {
    id: 'video',
    title: 'Videography',
    description: 'Professional video shoots for commercials, events, or creative projects',
    icon: '🎥'
  },
  {
    id: 'photo',
    title: 'Photography',
    description: 'High-quality photography for products, portraits, or special occasions',
    icon: '📸'
  },
  {
    id: 'editing',
    title: 'Video Editing',
    description: 'Post-production services including color grading and special effects',
    icon: '✂️'
  },
  {
    id: 'audio',
    title: 'Audio Production',
    description: 'Sound mixing, music production, and audio enhancement',
    icon: '🎵'
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Have something else in mind? Let me know your unique project needs',
    icon: '💡'
  }
];

interface ProjectTypeStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const ProjectTypeStep = ({ formData, updateFormData, onNext }: ProjectTypeStepProps) => {
  const handleSelectType = (type: string) => {
    updateFormData({ project_type: type });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="flex-1 flex flex-col"
    >
      <motion.h3 
        variants={itemVariants} 
        className="text-2xl font-bold mb-6 text-center"
      >
        What type of project are you looking for?
      </motion.h3>
      
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        {projectTypes.map((type) => (
          <motion.div
            key={type.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelectType(type.id)}
            className={cn(
              "cursor-pointer p-5 rounded-lg border-2 transition-all duration-200",
              formData.project_type === type.id
                ? "border-elvis-pink bg-elvis-pink/10 shadow-pink-glow"
                : "border-white/10 hover:border-white/30 bg-elvis-darker/50"
            )}
          >
            <div className="flex items-start">
              <div className="text-3xl mr-4">{type.icon}</div>
              <div>
                <h4 className="text-lg font-semibold">{type.title}</h4>
                <p className="text-white/70 text-sm mt-1">{type.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-auto">
        <Button
          onClick={onNext}
          className="w-full bg-elvis-gradient hover:shadow-pink-glow transition-all duration-300"
          size="lg"
          disabled={!formData.project_type}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectTypeStep;
