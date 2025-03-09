
import React, { useState } from 'react';
import { FormData } from './HireMeForm';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  
  // Calculate initial slider position
  const calculateInitialPosition = () => {
    for (let i = 0; i < budgetRanges.length; i++) {
      const range = budgetRanges[i];
      if (initialBudget >= range.min && initialBudget <= range.max) {
        const rangePercentage = (initialBudget - range.min) / (range.max - range.min);
        return (i + rangePercentage) / 5;
      }
    }
    return 0.5; // Default to middle if outside all ranges
  };
  
  const [sliderPosition, setSliderPosition] = useState(calculateInitialPosition() * 100);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Convert slider percentage to budget value
  const calculateBudget = (percentage: number) => {
    const normalizedPercentage = percentage / 100;
    const rangeIndex = Math.min(Math.floor(normalizedPercentage * 5), 4);
    const range = budgetRanges[rangeIndex];
    
    const rangePercentage = (normalizedPercentage * 5) - rangeIndex;
    const budget = range.min + rangePercentage * (range.max - range.min);
    
    return Math.round(budget / 100) * 100;
  };

  // Handle slider movement
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPosition = parseFloat(e.target.value);
    setSliderPosition(newPosition);
    const newBudget = calculateBudget(newPosition);
    updateFormData({ budget: newBudget });
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    updateFormData({ date: date || null });
    setIsCalendarOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="space-y-8">
        {/* Budget slider */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">What's your budget?</h3>
          
          <div className="relative py-10">
            {/* Budget display */}
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gradient">
                ${formData.budget?.toLocaleString() || '5,000'}
              </div>
              <div className="text-white/60 text-sm mt-1">Estimated Budget</div>
            </div>
            
            {/* Custom slider control */}
            <div className="relative">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition} 
                onChange={handleSliderChange}
                className="w-full h-2 bg-elvis-darker rounded-full appearance-none cursor-pointer"
                style={{
                  // Custom styling for the range input
                  background: `linear-gradient(to right, #ff00ff ${sliderPosition}%, #333 ${sliderPosition}%)`
                }}
              />
              
              {/* Budget milestones underneath the slider */}
              <div className="flex justify-between mt-2 px-1 text-xs text-white/60">
                {budgetRanges.map((range, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-1 w-1 bg-elvis-pink/40 rounded-full mb-1"></div>
                    <span>${range.min.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center">
                  <div className="h-1 w-1 bg-elvis-pink/40 rounded-full mb-1"></div>
                  <span>${budgetRanges[budgetRanges.length-1].max.toLocaleString()}+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Deadline picker */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">When do you need this completed?</h3>
          
          <div className="bg-elvis-darker p-4 rounded-lg">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-700",
                    !formData.date ? "text-white/60" : "text-white"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, 'PPP') : 'Select a target date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-elvis-medium border border-elvis-pink/30 pointer-events-auto" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.date || undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={{ before: new Date() }}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
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
