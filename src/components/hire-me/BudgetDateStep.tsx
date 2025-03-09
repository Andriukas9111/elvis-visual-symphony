
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormData } from './HireMeForm';
import { ChevronLeft, ChevronRight, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BudgetDateStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const budgetMarks = [
  { value: 500, label: '$500' },
  { value: 1000, label: '$1,000' },
  { value: 2500, label: '$2,500' },
  { value: 5000, label: '$5,000' },
  { value: 10000, label: '$10,000+' },
];

const BudgetDateStep: React.FC<BudgetDateStepProps> = ({ 
  formData, 
  updateFormData, 
  nextStep,
  prevStep
}) => {
  const [hoverBudget, setHoverBudget] = useState(formData.budget);

  const getBudgetDescription = (budget: number) => {
    if (budget < 1000) return "Basic video package with minimal editing";
    if (budget < 2500) return "Standard video package with professional editing";
    if (budget < 5000) return "Premium package with advanced effects and grading";
    if (budget < 10000) return "Complete production with multiple cameras and crew";
    return "Full-scale production with custom effects and animation";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Budget selection */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Project Budget & Date</h3>
        <p className="text-gray-400">Select your estimated budget and preferred timeline</p>
        
        <div className="mt-8 space-y-10">
          <div className="film-frame p-6">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-elvis-pink" />
              <h4 className="text-lg font-medium">Budget Range</h4>
            </div>
            
            <div className="mt-8 relative">
              {/* Budget slider track */}
              <div className="h-2 bg-elvis-medium rounded-full"></div>
              
              {/* Budget slider markers */}
              <div className="relative -mt-1">
                {budgetMarks.map((mark) => {
                  const left = `${(mark.value / 10000) * 100}%`;
                  const isActive = formData.budget >= mark.value;
                  
                  return (
                    <div 
                      key={mark.value} 
                      className="absolute -translate-x-1/2" 
                      style={{ left }}
                    >
                      <div 
                        className={`w-4 h-4 rounded-full ${
                          isActive ? 'bg-elvis-pink' : 'bg-elvis-medium'
                        }`}
                      ></div>
                      <span className="text-xs mt-2 block text-center">{mark.label}</span>
                    </div>
                  );
                })}
                
                {/* Budget slider thumb */}
                <motion.div 
                  className="w-6 h-6 bg-elvis-pink rounded-full shadow-pink-glow absolute -top-2 -translate-x-1/2 cursor-pointer"
                  style={{ left: `${(formData.budget / 10000) * 100}%` }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0}
                  dragMomentum={false}
                  onDrag={(_, info) => {
                    const parentWidth = info.target.parentElement?.clientWidth || 0;
                    const newX = info.point.x;
                    const percentage = Math.min(Math.max(newX / parentWidth, 0), 1);
                    const newBudget = Math.round(percentage * 10000 / 500) * 500;
                    setHoverBudget(newBudget);
                  }}
                  onDragEnd={() => {
                    updateFormData({ budget: hoverBudget });
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              </div>
              
              {/* Budget feedback */}
              <div className="mt-8 text-center">
                <div className="text-3xl font-bold text-elvis-pink">
                  ${formData.budget.toLocaleString()}
                </div>
                <div className="text-sm text-gray-300 mt-2">
                  {getBudgetDescription(formData.budget)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Date selection */}
          <div className="film-frame p-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-elvis-pink" />
              <h4 className="text-lg font-medium">Project Date</h4>
            </div>
            
            <div className="mt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-elvis-medium border-elvis-medium hover:bg-elvis-darker",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-elvis-darker border-elvis-medium" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formData.date || undefined}
                    onSelect={(date) => updateFormData({ date: date || null })}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <p className="text-sm text-gray-400 mt-2">
                Select your preferred project date. For events, this will be the event date.
                For other projects, this can be your target completion date.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <motion.button
          className="btn-outline px-6 py-2 rounded-full font-medium flex items-center"
          onClick={prevStep}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </motion.button>
        
        <motion.button
          className={`btn-primary px-8 py-3 rounded-full font-medium flex items-center ${
            !formData.date ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={nextStep}
          disabled={!formData.date}
          whileHover={{ scale: formData.date ? 1.05 : 1 }}
          whileTap={{ scale: formData.date ? 0.95 : 1 }}
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BudgetDateStep;
