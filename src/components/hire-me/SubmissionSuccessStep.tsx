
import React from 'react';
import { motion } from 'framer-motion';
import { FormData } from './HireMeForm';
import { Camera, Calendar, DollarSign, Mail, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface SubmissionSuccessStepProps {
  resetForm: () => void;
  formData: FormData;
}

const SubmissionSuccessStep: React.FC<SubmissionSuccessStepProps> = ({ resetForm, formData }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Confetti animation effect
  const confettiColors = ['#ff79c6', '#bd93f9', '#8be9fd', '#50fa7b', '#ffb86c'];
  const confettiCount = 100;
  
  return (
    <motion.div
      className="glass-card p-12 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: confettiCount }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          const x = Math.random() * 100;
          const animationDuration = Math.random() * 3 + 3;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: size,
                height: size,
                backgroundColor: color,
                top: -50,
                left: `${x}%`,
              }}
              initial={{ y: -50, x: 0, rotate: 0 }}
              animate={{
                y: window.innerHeight + 50,
                x: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: animationDuration,
                ease: 'linear',
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          );
        })}
      </div>
      
      {/* Success content */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="w-24 h-24 mx-auto bg-elvis-gradient rounded-full flex items-center justify-center animate-pulse">
          <Camera className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      
      <motion.h3 variants={itemVariants} className="text-3xl font-bold text-gradient mb-4">
        Thank You!
      </motion.h3>
      
      <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
        Your project request has been submitted successfully. I'll review the details and get back to you shortly.
      </motion.p>
      
      {/* Request summary */}
      <motion.div 
        variants={itemVariants}
        className="bg-elvis-medium/50 p-6 rounded-xl text-left max-w-md mx-auto mb-8"
      >
        <h4 className="text-xl font-semibold mb-4 text-white">Request Summary:</h4>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <Camera className="w-5 h-5 text-elvis-pink mr-3" />
            <span className="text-gray-300">
              <span className="font-medium">Project Type:</span> {formData.projectType?.charAt(0).toUpperCase() + formData.projectType?.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-elvis-pink mr-3" />
            <span className="text-gray-300">
              <span className="font-medium">Date:</span> {formData.date ? format(formData.date, 'MMMM d, yyyy') : 'Not specified'}
            </span>
          </div>
          
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-elvis-pink mr-3" />
            <span className="text-gray-300">
              <span className="font-medium">Budget:</span> ${formData.budget.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-elvis-pink mr-3" />
            <span className="text-gray-300">
              <span className="font-medium">Contact:</span> {formData.email}
            </span>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <button
          onClick={resetForm}
          className="btn-outline flex items-center mx-auto px-6 py-2 rounded-full"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Submit Another Request
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SubmissionSuccessStep;
