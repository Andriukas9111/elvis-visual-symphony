
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        return (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
                ${currentStep === step 
                  ? 'bg-violet-500 text-white' 
                  : currentStep > step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white/10 text-white/60'}`}
            >
              {currentStep > step ? <CheckCircle2 className="h-4 w-4" /> : step}
            </div>
            <span className="text-xs text-white/60 mt-1">
              {step === 1 ? 'Account' : 'Security'}
            </span>
          </div>
        );
      })}
      
      {/* Progress bar */}
      <div className="relative h-1 w-20 bg-white/10 rounded-full mx-2">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
          style={{
            width: `${(currentStep - 1) / (totalSteps - 1) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
