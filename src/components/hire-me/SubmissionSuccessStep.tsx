
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Card3D from './Card3D';

const SubmissionSuccessStep = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 flex flex-col items-center justify-center p-6"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="relative">
          <Card3D>
            <CheckCircle size={60} className="text-green-400" />
          </Card3D>
        </div>
      </motion.div>
      
      <motion.h3 
        variants={itemVariants} 
        className="text-2xl md:text-3xl font-bold text-center mb-4"
      >
        Request Submitted Successfully!
      </motion.h3>
      
      <motion.p 
        variants={itemVariants} 
        className="text-white/70 text-center max-w-md mb-8"
      >
        Thank you for your interest! I've received your project details and will review them as soon as possible. 
        Expect to hear back from me within 1-2 business days.
      </motion.p>
      
      <motion.div variants={itemVariants} className="space-x-4">
        <Button
          onClick={() => window.location.href = '/portfolio'}
          className="bg-elvis-gradient hover:shadow-pink-glow transition-all duration-300"
        >
          Explore Portfolio
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SubmissionSuccessStep;
