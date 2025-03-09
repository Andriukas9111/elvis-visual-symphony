
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface ProjectDetailsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ProjectDetailsStep = ({ formData, updateFormData, onNext, onPrev }: ProjectDetailsStepProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ project_description: e.target.value });
  };
  
  const isDisabled = !formData.project_description || 
                     formData.project_description.trim().length < 10;
  
  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      x: -50,
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
        className="text-2xl font-bold mb-2 text-center"
      >
        Tell us about your project
      </motion.h3>
      
      <motion.p 
        variants={itemVariants} 
        className="text-white/70 text-center mb-8"
      >
        Share the details of what you're looking to create
      </motion.p>
      
      <motion.div variants={itemVariants} className="mb-8">
        <Textarea
          placeholder="Describe your project in detail. What's the concept? What's the goal? Any specific requirements or ideas?"
          className="min-h-[200px] bg-elvis-darker border-white/20 focus:border-elvis-pink"
          value={formData.project_description}
          onChange={handleChange}
        />
        <div className="text-right mt-2 text-white/60 text-sm">
          {formData.project_description ? formData.project_description.length : 0} characters 
          (minimum 10)
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants} 
        className="mt-auto flex justify-between"
      >
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/5"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={onNext}
          className="bg-elvis-gradient hover:shadow-pink-glow transition-all duration-300"
          size="lg"
          disabled={isDisabled}
        >
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetailsStep;
