
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from 'lucide-react';

interface UnsavedChangesAlertProps {
  onSave: () => void;
  isSaving: boolean;
}

const UnsavedChangesAlert: React.FC<UnsavedChangesAlertProps> = ({ onSave, isSaving }) => {
  return (
    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-md p-3 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4 text-yellow-300 flex-shrink-0" />
      <p className="text-yellow-200 text-sm">
        You've changed the order of your media items. Don't forget to save your changes!
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="ml-auto border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/20"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Saving
          </>
        ) : (
          'Save Now'
        )}
      </Button>
    </div>
  );
};

export default UnsavedChangesAlert;
