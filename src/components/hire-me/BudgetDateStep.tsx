
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const budgetRanges = [
  {
    id: 'under_1000',
    label: 'Under $1,000',
    value: 1000
  },
  {
    id: '1000_3000',
    label: '$1,000 - $3,000',
    value: 3000
  },
  {
    id: '3000_5000',
    label: '$3,000 - $5,000',
    value: 5000
  },
  {
    id: '5000_10000',
    label: '$5,000 - $10,000',
    value: 10000
  },
  {
    id: 'above_10000',
    label: 'Above $10,000',
    value: 15000
  },
  {
    id: 'custom',
    label: 'Custom Budget',
    value: undefined
  }
];

const timelineOptions = [
  { id: 'urgent', label: 'Urgent (ASAP)' },
  { id: 'one_month', label: 'Within 1 Month' },
  { id: 'three_months', label: 'Within 3 Months' },
  { id: 'six_months', label: 'Within 6 Months' },
  { id: 'flexible', label: 'Flexible' }
];

interface BudgetDateStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const BudgetDateStep = ({ 
  formData, 
  updateFormData, 
  onPrev, 
  onSubmit,
  isSubmitting
}: BudgetDateStepProps) => {
  const [showCustomBudget, setShowCustomBudget] = useState(
    formData.budget && !budgetRanges.some(range => range.value === formData.budget)
  );
  
  const handleSelectBudget = (budget: number | undefined) => {
    if (budget === undefined) {
      setShowCustomBudget(true);
      // Don't update the budget yet for custom
    } else {
      setShowCustomBudget(false);
      updateFormData({ budget });
    }
  };
  
  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      updateFormData({ budget: parseInt(value) });
    } else {
      updateFormData({ budget: undefined });
    }
  };
  
  const handleSelectTimeline = (timeline: string) => {
    updateFormData({ timeline });
  };
  
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
        Budget & Timeline
      </motion.h3>
      
      <motion.p 
        variants={itemVariants} 
        className="text-white/70 text-center mb-8"
      >
        Help us understand your budget constraints and timeline
      </motion.p>
      
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="space-y-4">
          <Label>What's your estimated budget?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {budgetRanges.map((range) => (
              <Button
                key={range.id}
                type="button"
                onClick={() => handleSelectBudget(range.value)}
                variant="outline"
                className={cn(
                  "h-auto py-2 px-4 border-white/20 hover:bg-white/5 justify-start",
                  (range.id === 'custom' && showCustomBudget) || 
                  (range.value === formData.budget && !showCustomBudget)
                    ? "bg-elvis-pink/10 border-elvis-pink text-white"
                    : ""
                )}
              >
                {range.label}
              </Button>
            ))}
          </div>
          
          {showCustomBudget && (
            <div className="mt-3">
              <Label htmlFor="customBudget">Enter your budget:</Label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/60">$</span>
                </div>
                <Input
                  id="customBudget"
                  className="pl-8 bg-elvis-darker border-white/20 focus:border-elvis-pink"
                  placeholder="Enter amount"
                  value={formData.budget || ''}
                  onChange={handleCustomBudgetChange}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <Label>When do you need this completed?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timelineOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                onClick={() => handleSelectTimeline(option.id)}
                variant="outline"
                className={cn(
                  "h-auto py-2 px-4 border-white/20 hover:bg-white/5 justify-start",
                  formData.timeline === option.id
                    ? "bg-elvis-pink/10 border-elvis-pink text-white"
                    : ""
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants} 
        className="mt-auto flex justify-between pt-8"
      >
        <Button
          onClick={onPrev}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/5"
          size="lg"
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={onSubmit}
          className="bg-elvis-gradient hover:shadow-pink-glow transition-all duration-300"
          size="lg"
          disabled={isSubmitting || !formData.budget || !formData.timeline}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default BudgetDateStep;
