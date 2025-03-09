
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FormStepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const FormStepIndicator = ({ steps, currentStep }: FormStepIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center relative">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  index <= currentStep
                    ? "border-elvis-pink bg-elvis-pink/20 text-white"
                    : "border-white/30 bg-elvis-dark/50 text-white/50"
                )}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: index === currentStep ? 1.1 : 1,
                  backgroundColor: index === currentStep ? 'rgba(236, 72, 153, 0.3)' : ''
                }}
                transition={{ duration: 0.3 }}
              >
                {index < currentStep ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              
              {/* Step label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium hidden md:block",
                  index <= currentStep ? "text-white" : "text-white/50"
                )}
              >
                {step}
              </span>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2">
                <div className="h-1 bg-white/20 rounded relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-elvis-pink rounded"
                    initial={{ width: "0%" }}
                    animate={{
                      width: index < currentStep ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormStepIndicator;
