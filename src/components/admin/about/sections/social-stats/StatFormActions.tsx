
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StatFormActionsProps } from './types';

const StatFormActions: React.FC<StatFormActionsProps> = ({ 
  onSave, 
  addStat, 
  isSubmitting 
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Statistics</h2>
        <Button onClick={addStat} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Stat
        </Button>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onSave}
          disabled={isSubmitting}
        >
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default StatFormActions;
