
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FormStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onChange: (step: number) => void;
}

const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({ 
  steps, 
  currentStep,
  onChange
}) => {
  return (
    <div className="relative px-2 max-w-full overflow-hidden">
      {/* Progress line */}
      <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-elvis-medium">
        <motion.div 
          className="h-full bg-elvis-pink"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center relative cursor-pointer"
              onClick={() => onChange(index)}
            >
              {/* Step circle */}
              <motion.div 
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 mb-2 transition-colors duration-300",
                  isCompleted || isActive ? "bg-elvis-gradient shadow-glow" : "bg-elvis-medium"
                )}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  opacity: 1 
                }}
                transition={{ duration: 0.3 }}
              >
                {step.icon}
              </motion.div>
              
              {/* Step title and description for medium screens and up */}
              <div className="text-center max-w-[80px] md:max-w-none">
                <motion.div 
                  className={cn(
                    "text-[10px] md:text-xs font-semibold transition-colors duration-300",
                    isActive ? "text-elvis-pink" : "text-white",
                    isCompleted && !isActive ? "text-gray-300" : ""
                  )}
                  animate={{ opacity: 1 }}
                >
                  {step.title}
                </motion.div>
                
                <motion.div 
                  className={cn(
                    "text-[8px] md:text-[10px] transition-colors duration-300 hidden sm:block",
                    isActive ? "text-gray-300" : "text-gray-500",
                  )}
                  animate={{ opacity: isActive ? 1 : 0.7 }}
                >
                  {step.description}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormStepIndicator;
