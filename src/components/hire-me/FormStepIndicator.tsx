
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormStepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const FormStepIndicator: React.FC<FormStepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between items-center w-full">
      {steps.map((step, index) => (
        <React.Fragment key={`step-${index}`}>
          {/* Step indicator */}
          <div className="flex flex-col items-center relative">
            <motion.div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200",
                index <= currentStep 
                  ? "bg-elvis-gradient text-white" 
                  : "bg-elvis-darker text-gray-400 border border-elvis-pink/30"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{index + 1}</span>
              )}
            </motion.div>
            <div className="text-xs mt-2 text-center">
              <span className={index <= currentStep ? "text-elvis-pink font-medium" : "text-gray-400"}>
                {step}
              </span>
            </div>
          </div>
          
          {/* Connector line (except after the last step) */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-px mx-2">
              <div 
                className="h-full bg-gradient-to-r from-elvis-pink/50 to-elvis-pink/5"
                style={{
                  width: index < currentStep ? '100%' : '0%',
                  transition: 'width 0.5s ease-in-out'
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FormStepIndicator;
