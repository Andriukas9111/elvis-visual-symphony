
import React from 'react';

interface SavedConfirmationProps {
  lastSaveTime: string;
}

const SavedConfirmation: React.FC<SavedConfirmationProps> = ({ lastSaveTime }) => {
  return (
    <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3">
      <p className="text-green-200 text-sm">
        Order saved successfully at {lastSaveTime}
      </p>
    </div>
  );
};

export default SavedConfirmation;
