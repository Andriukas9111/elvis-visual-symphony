
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SavedConfirmationProps {
  lastSaveTime: string;
}

const SavedConfirmation: React.FC<SavedConfirmationProps> = ({ lastSaveTime }) => {
  return (
    <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3 flex items-center">
      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
      <p className="text-green-200 text-sm">
        Order saved successfully at {lastSaveTime}
      </p>
    </div>
  );
};

export default SavedConfirmation;
