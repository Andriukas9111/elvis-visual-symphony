
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, PanInfo } from 'framer-motion';
import { FormData } from './HireMeForm';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface BudgetDateStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const BudgetDateStep: React.FC<BudgetDateStepProps> = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  // Budget ranges - we use this to map the slider position to actual budget values
  const budgetRanges = [
    { min: 1000, max: 2500 },
    { min: 2500, max: 5000 },
    { min: 5000, max: 10000 },
    { min: 10000, max: 25000 },
    { min: 25000, max: 50000 }
  ];
  
  // Initialize with budget from formData or default to 5000
  const initialBudget = formData.budget || 5000;
  
  // Find initial percentage based on the initialBudget
  const findInitialPercentage = () => {
    // Find which range our budget falls into
    const range = budgetRanges.find(r => initialBudget >= r.min && initialBudget <= r.max);
    
    if (!range) {
      // If budget is outside all ranges, default to 50%
      return 0.5;
    }
    
    // Calculate percentage within the range
    return (initialBudget - range.min) / (range.max - range.min);
  };
  
  const [sliderPercentage, setSliderPercentage] = useState(findInitialPercentage());
  const [activeDateField, setActiveDateField] = useState<string | null>(null);
  const x = useMotionValue(0);

  // Calculate budget based on slider percentage
  const calculateBudget = (percentage: number) => {
    // Map percentage to budget range index (0-4)
    const rangeIndex = Math.min(Math.floor(percentage * 5), 4);
    const range = budgetRanges[rangeIndex];
    
    // Calculate position within that range
    const rangePercentage = (percentage * 5) - rangeIndex;
    const budget = range.min + rangePercentage * (range.max - range.min);
    
    return Math.round(budget / 100) * 100; // Round to nearest hundred
  };

  // Update budget whenever slider percentage changes
  useEffect(() => {
    const budget = calculateBudget(sliderPercentage);
    updateFormData({ budget });
  }, [sliderPercentage, updateFormData]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="space-y-10">
        {/* Budget slider */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">What's your budget?</h3>
          
          <div className="relative py-10">
            {/* Budget display */}
            <div className="absolute top-0 left-0 right-0 text-center mb-6">
              <div className="text-4xl font-bold text-gradient">
                ${formData.budget?.toLocaleString() || '5,000'}
              </div>
              <div className="text-white/60 text-sm mt-1">Estimated Budget</div>
            </div>
            
            {/* Slider track */}
            <div className="relative h-2 bg-elvis-darker rounded-full mt-20">
              {/* Colored part of the track */}
              <div 
                className="absolute top-0 left-0 h-full bg-elvis-gradient rounded-full"
                style={{ width: `${sliderPercentage * 100}%` }}
              ></div>
              
              {/* Budget milestones */}
              <div className="absolute top-4 left-0 right-0 flex justify-between mt-2">
                {budgetRanges.map((range, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-1 h-3 bg-elvis-pink/40 rounded-full"></div>
                    <span className="text-xs text-white/60 mt-1">${range.min.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-3 bg-elvis-pink/40 rounded-full"></div>
                  <span className="text-xs text-white/60 mt-1">${budgetRanges[budgetRanges.length-1].max.toLocaleString()}+</span>
                </div>
              </div>
              
              {/* Slider thumb */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-elvis-pink rounded-full cursor-grab active:cursor-grabbing"
                style={{ 
                  left: `calc(${sliderPercentage * 100}% - 12px)`,
                  boxShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={(event, info) => {
                  // Get the slider container
                  const currentTarget = event.currentTarget as HTMLElement;
                  const sliderTrack = currentTarget.parentElement as HTMLElement;
                  if (!sliderTrack) return;
                  
                  const sliderWidth = sliderTrack.getBoundingClientRect().width;
                  const offsetX = info.point.x - sliderTrack.getBoundingClientRect().left;
                  
                  // Calculate percentage position (0 to 1)
                  const percentage = Math.min(Math.max(offsetX / sliderWidth, 0), 1);
                  setSliderPercentage(percentage);
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Deadline picker */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white">When do you need this completed?</h3>
          
          <div className="bg-elvis-darker p-4 rounded-lg">
            <Popover open={activeDateField === 'date'} onOpenChange={open => setActiveDateField(open ? 'date' : null)}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal border-gray-700 ${!formData.date ? 'text-white/60' : 'text-white'}`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, 'PPP') : 'Select a target date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-elvis-medium border border-elvis-pink/30" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.date || undefined}
                  onSelect={date => {
                    updateFormData({ date });
                    setActiveDateField(null);
                  }}
                  initialFocus
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={prevStep}
            className="border-elvis-pink text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            type="button" 
            className="bg-elvis-gradient text-white"
            onClick={nextStep}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BudgetDateStep;
